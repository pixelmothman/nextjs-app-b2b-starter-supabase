'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod';
import { createClient } from '@/utils/supabase/server'
import { validateFormData } from './formValidation';
import { AuthenticationError, DBError, LogicValidationError, ValidationError } from './customErrorClasses';
import { handleError } from './errorHandler';
import { v4 as uuidv4 } from 'uuid';
import { createSupaServerClient } from './supabase/superServer';
import { redirect } from 'next/navigation';
import { isUserOnlyOwnerInOrg, isUserOrgRole, isUserPartOfOrg, isUserPartOfOrgByUserEmail, isUserRemovingThemselves } from './data';

//---------------------------------------------------------------------

// Server actions related to the supabase login process

// server action for login
const LoginDataSchema = z.object({
    loginEmail: z.string().email(),
  });
  export async function login(prevState: any, formData: FormData) {
    try {
      const supabase = createClient()
      
      //get the data from the form
      const dataFromForm = await validateFormData(formData, LoginDataSchema);
      
      //sign in the user
      const { error } = await supabase.auth.signInWithOtp({
        email: dataFromForm.loginEmail,
        options: {
          // set this to false if you do not want the user to be automatically signed up
          shouldCreateUser: false,
        },
      })
  
      if (error) {
        throw new AuthenticationError('Failed to log in');
      };
    } catch (e: any) {
      return handleError(e);
    }
  
    revalidatePath('/', 'layout');
    return {
      success: true,
    };
  }
  
  // server action for signup
  const SignUpDataSchema = z.object({
    signupEmail: z.string().email(),
  });
  export async function signup(prevState: any, formData: FormData) {
    try {
      const supabase = createClient()
      
      //get the data from the form
      const dataFromForm = await validateFormData(formData, SignUpDataSchema);
      
      //sign up the user
      const { error } = await supabase.auth.signInWithOtp({
        email: dataFromForm.signupEmail,
        options: {
          // set this to false if you do not want the user to be automatically signed up
          shouldCreateUser: true,
        },
      })
  
      if (error) {
        console.log(error)
        throw new AuthenticationError('Failed to sign up');
      };
    } catch (e: any) {
      return handleError(e);
    }
  
    revalidatePath('/', 'layout');
    return {
      success: true,
    };
  }
//---------------------------------------------------------------------


//---------------------------------------------------------------------

// Server actions related to the personal account

// server action to update the user's email
const EditAccountEmailDataSchema = z.object({
  accountEmail: z.string()
});
export async function editAccountEmail(prevState: any, formData: FormData) {
  try {
    const supabase = createClient()

    //check the user exists
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
        throw new AuthenticationError('User not found');
    };

    //get the data from the form
    const dataFromForm = await validateFormData(formData, EditAccountEmailDataSchema);
        
    //check if the email is the same as the current email
    if (dataFromForm.accountEmail === data.user.email) {
      throw new LogicValidationError('Email is the same as the current email')
    }

    //update the user's email
    const { error: updateUserEmailError } = await supabase.auth.updateUser({
      email: dataFromForm.accountEmail
    })

    if (updateUserEmailError) {
      throw new DBError('Failed to update email')
    }
  } catch (e: any) {
    return handleError(e);
  }

  revalidatePath('/', 'layout');
  return {
    success: true,
  };
}
//---------------------------------------------------------------------


//---------------------------------------------------------------------

// Server actions related to organizations

// server action to create a new organization
const CreateOrgDataSchema = z.object({
  orgName: z.string().min(3).max(40)
});
export async function createOrg(prevState: any, formData: FormData) {
  const maxRetries = 3;
  let orgID;
  try {
    let supabase = createClient()

    //check the user exists
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
        throw new AuthenticationError('User not found');
    };

    //get the data from the form
    const dataFromForm = await validateFormData(formData, CreateOrgDataSchema);

    //delete previous instance of supabase client and start using supabase client with server role now
    supabase = createSupaServerClient();
    
    //create the organization
    const { data: orgData, error: createOrgDataError } = await supabase.from('org_table').insert({
      org_name: dataFromForm.orgName
    }).select()
    if (createOrgDataError || !orgData || orgData.length === 0) {
      throw new DBError('Failed to create new organization')
    };

    // Add the user to the organization with retries
    let retryCount = 0;
    let addOrgMemberError = null;
    while (retryCount < maxRetries) {
      const { error: currentAddOrgMemberError } = await supabase.from('org_membership_table').insert({
        user_id: data.user.id,
        org_id: orgData[0].org_id,
        org_membership_status: 'confirmed'
      });

      if (!currentAddOrgMemberError) {
        addOrgMemberError = null;
        break;
      }

      addOrgMemberError = currentAddOrgMemberError;
      retryCount++;
    };

    if (addOrgMemberError) {
      // Attempt to delete the organization if adding the user fails
      await supabase.from('org_table').delete().eq('org_id', orgData[0].org_id);
      throw new DBError('Failed to add user to the organization after multiple attempts. Organization deleted.');
    }

    orgID = orgData[0].org_id
    revalidatePath('/dashboard', 'layout');
  } catch (e: any) {
    return handleError(e);
  }
  redirect(`/dashboard/${orgID}`);
}


// server action to change the organization name
const EditOrgNameDataSchema = z.object({
  orgID: z.string(),
  orgName: z.string().min(3).max(40)
})

export async function editOrgName(prevState: any, formData: FormData){
  try {
    let supabase = createClient();

    //check the user exists
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
        throw new AuthenticationError('User not found');
    };
    const user = data.user;
    
    //get the data from the form
    const dataFromForm = await validateFormData(formData, EditOrgNameDataSchema);

    //delete previous instance of supabase client and start using supabase client with server role now
    supabase = createSupaServerClient();

    //check if the user belongs to the org
    const checkIfUserIsPartOfOrg =  await isUserPartOfOrg(dataFromForm.orgID);
    if(!checkIfUserIsPartOfOrg || !('isUserPartOfOrg' in checkIfUserIsPartOfOrg) || checkIfUserIsPartOfOrg.isUserPartOfOrg === false){
      throw new LogicValidationError('User is not part of the org')
    };

    //check if the user calling this function has an owner role in the org
    const checkIfUserHasOwnerRole =  await isUserOrgRole(dataFromForm.orgID, user.id, 'owner');
    if(!checkIfUserHasOwnerRole || !('isUserOrgRole' in checkIfUserHasOwnerRole) || checkIfUserHasOwnerRole.isUserOrgRole === false){
      throw new LogicValidationError('User does not have an owner role in the org')
    };

    //update the org name
    const { error: updateOrgNameDataError } = await supabase.from('org_table').update({
      org_name: dataFromForm.orgName
    }).eq('org_id', dataFromForm.orgID);
    if(updateOrgNameDataError){
      throw new DBError('Failed to update the organization name')
    };

    revalidatePath(`/dashboard/${dataFromForm.orgID}/settings/general`, 'page');
    return {
      success: true,
      successID: uuidv4()
    };

  } catch(e: any) {
    return handleError(e);
  }
};

// server action to change the organization name
const EditOrgUserSettingsDataSchema = z.object({
  orgID: z.string(),
  orgUserExclusivity: z.enum(['true', 'false'])
})

export async function editOrgUserSettings(prevState: any, formData: FormData){
  try {
    let supabase = createClient();

    //check the user exists
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
        throw new AuthenticationError('User not found');
    };
    const user = data.user;
    
    //get the data from the form
    const dataFromForm = await validateFormData(formData, EditOrgUserSettingsDataSchema);

    //delete previous instance of supabase client and start using supabase client with server role now
    supabase = createSupaServerClient();

    //check if the user belongs to the org
    const checkIfUserIsPartOfOrg =  await isUserPartOfOrg(dataFromForm.orgID);
    if(!checkIfUserIsPartOfOrg || !('isUserPartOfOrg' in checkIfUserIsPartOfOrg) || checkIfUserIsPartOfOrg.isUserPartOfOrg === false){
      throw new LogicValidationError('User is not part of the org')
    };

    //check if the user calling this function has an owner role in the org
    const checkIfUserHasOwnerRole =  await isUserOrgRole(dataFromForm.orgID, user.id, 'owner');
    if(!checkIfUserHasOwnerRole || !('isUserOrgRole' in checkIfUserHasOwnerRole) || checkIfUserHasOwnerRole.isUserOrgRole === false){
      throw new LogicValidationError('User does not have an owner role in the org')
    };

    //update the org user settings
    const { error: updateOrgNameDataError } = await supabase.from('org_table').update({
      org_user_exclusivity: dataFromForm.orgUserExclusivity
    }).eq('org_id', dataFromForm.orgID);
    if(updateOrgNameDataError){
      throw new DBError('Failed to update the organization settings')
    };

    revalidatePath(`/dashboard/${dataFromForm.orgID}`, 'layout');
    return {
      success: true,
      successID: uuidv4()
    };

  } catch(e: any) {
    return handleError(e);
  }
};


// server action to get the organization members
const GetOrgMembersDataSchema = z.object({
  orgID: z.string()
});

export async function getOrgMembers(prevState: any, formData: FormData){
  let dataFromForm;
  try {
    let supabase = createClient();

    //check the user exists
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
        throw new AuthenticationError('User not found');
    };
    const user = data.user;
    
    //get the data from the form
    dataFromForm = await validateFormData(formData, GetOrgMembersDataSchema);

    //delete previous instance of supabase client and start using supabase client with server role now
    supabase = createSupaServerClient();

    //check if the user belongs to the org
    const checkIfUserIsPartOfOrg =  await isUserPartOfOrg(dataFromForm.orgID);
    if(!checkIfUserIsPartOfOrg || !('isUserPartOfOrg' in checkIfUserIsPartOfOrg) || checkIfUserIsPartOfOrg.isUserPartOfOrg === false){
      throw new LogicValidationError('User is not part of the org')
    };

    //get the org members
    const { data: orgMembersData, error: orgMembersDataError } = await supabase.from('org_membership_table').select(`
      user_email: user_table!org_membership_table_user_id_fkey (
        user_email
      ),
      org_membership_role,
      org_membership_status,
      invited_by: user_table!org_membership_table_invited_by_fkey (
        user_email
      )
    `).eq('org_id', dataFromForm.orgID).single();

    if (orgMembersDataError) {
      throw new DBError('Failed to retrieve org members')
    };

    revalidatePath(`/dashboard/${dataFromForm.orgID}`, 'layout');
    return {
      success: true,
      orgMembers: orgMembersData,
      successID: uuidv4()
    }
  } catch(e: any) {
    return handleError(e);
  }
}


// server action to invite user to organization
const InviteUserToOrgDataSchema = z.object({
  orgID: z.string(),
  emailOfInvitedUser: z.string().email(),
  userRoleInOrgState: z.enum(['owner', 'member'])
});

export async function inviteUserToOrg(prevState: any, formData: FormData){
  let dataFromForm;
  try {
    let supabase = createClient();

    //check the user exists
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
        throw new AuthenticationError('User not found');
    };
    const user = data.user;
    
    //get the data from the form
    dataFromForm = await validateFormData(formData, InviteUserToOrgDataSchema);

    //delete previous instance of supabase client and start using supabase client with server role now
    supabase = createSupaServerClient();

    //check if the user belongs to the org
    const checkIfUserIsPartOfOrg =  await isUserPartOfOrg(dataFromForm.orgID);
    if(!checkIfUserIsPartOfOrg || !('isUserPartOfOrg' in checkIfUserIsPartOfOrg) || checkIfUserIsPartOfOrg.isUserPartOfOrg === false){
      throw new LogicValidationError('User is not part of the org')
    };

    //check if the user calling this function has an owner role in the org
    const checkIfUserHasOwnerRole =  await isUserOrgRole(dataFromForm.orgID, user.id, 'owner');
    if(!checkIfUserHasOwnerRole || !('isUserOrgRole' in checkIfUserHasOwnerRole) || checkIfUserHasOwnerRole.isUserOrgRole === false){
      throw new LogicValidationError('User does not have an owner role in the org')
    };

    //check if person invited is a user of the app
    const { data: userData, error: userError } = await supabase.from('user_table').select('user_id, user_email').eq('user_email', dataFromForm.emailOfInvitedUser);
    if (userError) {
      throw new DBError('Failed to check if user is part of the system')
    };

    //if person invited is already a user of the app
    if(userData && userData.length > 0){
      if (userData[0].user_email === dataFromForm.emailOfInvitedUser) {
        //check if the user is already part of the org
        const checkIfUserIsPartOfOrgByUserEmail =  await isUserPartOfOrgByUserEmail(dataFromForm.orgID, dataFromForm.emailOfInvitedUser);
        if(!checkIfUserIsPartOfOrgByUserEmail || !('isUserPartOfOrg' in checkIfUserIsPartOfOrgByUserEmail) || checkIfUserIsPartOfOrgByUserEmail.isUserPartOfOrg === true){
          throw new LogicValidationError('User is already part of the org')
        }
        //add the user to the org
        if(!checkIfUserIsPartOfOrgByUserEmail || !('isUserPartOfOrg' in checkIfUserIsPartOfOrgByUserEmail) || checkIfUserIsPartOfOrgByUserEmail.isUserPartOfOrg === false){
          const { error: orgMembershipDataError } = await supabase.from('org_membership_table').insert({
            org_id: dataFromForm.orgID,
            user_id: userData[0].user_id,
            org_membership_role: dataFromForm.userRoleInOrgState,
            org_membership_status: 'pending',
            invited_by: data.user.id
          });
          if (orgMembershipDataError) {
            throw new DBError('Failed to invite user to the org')
          };
        };
      };
    };

    //if person invited is not a user of the app
    if (!userData || userData.length === 0) {
      // Attempt to invite the user to the app
      const { error: inviteError } = await supabase.auth.admin.inviteUserByEmail(dataFromForm.emailOfInvitedUser);
      if (inviteError) {
        throw new DBError('Failed to invite person to the app');
      }
      // Retrieve the new user's data
      const { data: newUser, error: newUserError } = await supabase.from('user_table')
      .select('user_id')
      .eq('user_email', dataFromForm.emailOfInvitedUser)
      .single();
      if (newUserError || !newUser) {
        throw new DBError('Failed to retrieve newly invited user data');
      }
      // Add the new user to the org
      const { error: orgAddError } = await supabase.from('org_membership_table').insert({
        org_id: dataFromForm.orgID,
        user_id: newUser.user_id,
        org_membership_role: dataFromForm.userRoleInOrgState,
        org_membership_status: 'pending',
        invited_by: data.user.id
      });
      if (orgAddError) {
          throw new DBError('Failed to add newly invited user to the org');
      };
    };
  } catch (e: any) {
    return handleError(e);
  }

  revalidatePath(`/dashboard/${dataFromForm.orgID}`, 'layout');
  return {
    success: true,
    successID: uuidv4()
  };
};


// server action to update the role of a user in the organization
const UpdateUserRoleInOrgDataSchema = z.object({
  orgID: z.string(),
  emailFromUserToUpdate: z.string().email(),
  newRole: z.enum(['owner', 'member'])
});
export async function editUserRoleInOrg(prevState: any, formData: FormData){
  let dataFromForm;
  try {
    let supabase = createClient();

    //check the user exists
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
        throw new AuthenticationError('User not found');
    };
    const user = data.user;
    
    //get the data from the form
    dataFromForm = await validateFormData(formData, UpdateUserRoleInOrgDataSchema);

    //delete previous instance of supabase client and start using supabase client with server role now
    supabase = createSupaServerClient();

    //check if the user calling this function belongs to the org
    const checkIfUserIsPartOfOrg =  await isUserPartOfOrg(dataFromForm.orgID);
    if(!checkIfUserIsPartOfOrg || !('isUserPartOfOrg' in checkIfUserIsPartOfOrg) || checkIfUserIsPartOfOrg.isUserPartOfOrg === false){
      throw new LogicValidationError('User is not part of the org')
    };

    //check if the user calling this function has an owner role in the org
    const checkIfUserHasOwnerRole =  await isUserOrgRole(dataFromForm.orgID, user.id, 'owner');
    if(!checkIfUserHasOwnerRole || !('isUserOrgRole' in checkIfUserHasOwnerRole) || checkIfUserHasOwnerRole.isUserOrgRole === false){
      throw new LogicValidationError('User does not have an owner role in the org')
    };

    //check that the current user is not the only user with a Owner role in the organization
    const checkIfUserHasOnlyOwnerRole = await isUserOnlyOwnerInOrg(dataFromForm.orgID, dataFromForm.emailFromUserToUpdate);
    if(!checkIfUserHasOnlyOwnerRole || !('isUserOnlyOwnerInOrg' in checkIfUserHasOnlyOwnerRole) || checkIfUserHasOnlyOwnerRole.isUserOnlyOwnerInOrg === true){
      throw new LogicValidationError('User is the only user with an owner role in the org');
    };

    //get the user data
    const { data: userData, error: userError } = await supabase.from('user_table').select('user_id').eq('user_email', dataFromForm.emailFromUserToUpdate);
    if (userError) {
      throw new DBError('Failed to retrieve user data')
    };

    //update the user role in the org
    const { error: updateUserRoleInOrgError } = await supabase.from('org_membership_table').update({
      org_membership_role: dataFromForm.newRole
    }).eq('user_id', userData[0].user_id).eq('org_id', dataFromForm.orgID);
    if (updateUserRoleInOrgError) {
      throw new DBError('Failed to update user role in the org')
    };
  } catch (e: any) {
    return handleError(e);
  }

  revalidatePath(`/dashboard/${dataFromForm.orgID}/settings/usermanagement`, 'layout');
  return {
    success: true,
    successID: uuidv4()
  };
};


// server action for removing a user from the organization
const RemoveUserFromOrgDataSchema = z.object({
  orgID: z.string(),
  emailFromUserToRemove: z.string().email(),
});
export async function removeUserFromOrg(prevState: any, formData: FormData){
  let dataFromForm;
  try {
    let supabase = createClient();

    //check the user exists
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
        throw new AuthenticationError('User not found');
    };
    const user = data.user;
    
    //get the data from the form
    dataFromForm = await validateFormData(formData, RemoveUserFromOrgDataSchema);

    //delete previous instance of supabase client and start using supabase client with server role now
    supabase = createSupaServerClient();

    //check if the user calling this function belongs to the org
    const checkIfUserIsPartOfOrg =  await isUserPartOfOrg(dataFromForm.orgID);
    if(!checkIfUserIsPartOfOrg || !('isUserPartOfOrg' in checkIfUserIsPartOfOrg) || checkIfUserIsPartOfOrg.isUserPartOfOrg === false){
      throw new LogicValidationError('User calling this function is not part of the org')
    };

    //check if the user calling this function has an owner role in the org
    const checkIfUserHasOwnerRole =  await isUserOrgRole(dataFromForm.orgID, user.id, 'owner');
    if(!checkIfUserHasOwnerRole || !('isUserOrgRole' in checkIfUserHasOwnerRole) || checkIfUserHasOwnerRole.isUserOrgRole === false){
      throw new LogicValidationError('User does not have an owner role in the org')
    };

    //check if the user that is being removed is part of the org
    const checkIfUserIsPartOfOrgByUserEmail =  await isUserPartOfOrgByUserEmail(dataFromForm.orgID, dataFromForm.emailFromUserToRemove);
    if(!checkIfUserIsPartOfOrgByUserEmail || !('isUserPartOfOrg' in checkIfUserIsPartOfOrgByUserEmail) || checkIfUserIsPartOfOrgByUserEmail.isUserPartOfOrg === false || !checkIfUserIsPartOfOrgByUserEmail.userIDByEmail){
      throw new LogicValidationError('User that is being removed is not part of the org')
    };

    //check that the current user is not self-removing if they are the sole or only confirmed user in the organization
    const checkIfUserIsRemovingThemselves = await isUserRemovingThemselves(dataFromForm.orgID, checkIfUserIsPartOfOrgByUserEmail.userIDByEmail);
    if(checkIfUserIsRemovingThemselves === true){
      throw new LogicValidationError('User is the only user / confirmed user in the org')
    };

    //get the user data
    const { data: userData, error: userError } = await supabase.from('user_table').select('user_id').eq('user_email', dataFromForm.emailFromUserToRemove);
    if (userError) {
      throw new DBError('Failed to retrieve user data')
    };

    //remove the user from the org
    const { error: removeUserFromOrgError } = await supabase.from('org_membership_table').delete().eq('user_id', userData[0].user_id).eq('org_id', dataFromForm.orgID);
    if (removeUserFromOrgError) {
      throw new DBError('Failed to remove user from the org')
    };
  } catch (e: any) {
    return handleError(e);
  }

  revalidatePath(`/dashboard/${dataFromForm.orgID}/settings/usermanagement`, 'layout');
  return {
    success: true,
    successID: uuidv4()
  };
}

//---------------------------------------------------------------------