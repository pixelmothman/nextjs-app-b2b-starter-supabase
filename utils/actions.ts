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

// Server actions related to the personal account

// server action to update the user's email
const CreateOrgDataSchema = z.object({
  orgName: z.string().min(3).max(40)
});
export async function createOrg(prevState: any, formData: FormData) {
  const maxRetries = 3;
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
    }

    if (addOrgMemberError) {
      // Attempt to delete the organization if adding the user fails
      await supabase.from('org_table').delete().eq('org_id', orgData[0].org_id);
      throw new DBError('Failed to add user to the organization after multiple attempts. Organization deleted.');
    }
  } catch (e: any) {
    return handleError(e);
  }

  revalidatePath('/dashboard', 'layout');
  redirect('/dashboard');
}
//---------------------------------------------------------------------