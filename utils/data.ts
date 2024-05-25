'use server'

import { unstable_noStore as noStore } from "next/cache";
import { createClient } from '@/utils/supabase/server'
import { createSupaServerClient } from "./supabase/superServer";
import { AuthenticationError, DBError, LogicValidationError } from './customErrorClasses';
import { ErrorResponse, handleError } from "./errorHandler";

//---------------------------------------------------------------------
// Server-side functions related to orgs

// external - server-side function to get orgs that the user is part of
export async function getOrgs(){
    //prevents the response from being cached
    noStore();
    try {
        let supabase = createClient();

        //check the user exists
        const { data, error } = await supabase.auth.getUser()
        if (error || !data?.user) {
            throw new AuthenticationError('User not found');
        };
        const user = data.user

        //delete previous instance of supabase client and start using supabase client with server role now
        supabase = createSupaServerClient();

        //check the user is part of the org and fetch the org name
        const {data: orgMembershipData, error: orgMembershipDataError} = await supabase.from("org_membership_table").select(`
        org_id,
        org_name: org_table!org_membership_table_org_id_fkey (org_name)
        `).eq('user_id', user.id).neq('org_membership_status', 'pending');
        if (orgMembershipDataError) {
            throw new DBError('Failed to check user membership data');
        };
        
        //if the user is not a member of any orgs, return
        if(!orgMembershipData || orgMembershipData.length === 0){
            return [];
        };
        
        return orgMembershipData;
    } catch (e: any) {
        return handleError(e);
    };
};

// external - server-side function to get the current org name based on the org id
export async function getCurrentOrgName(orgId: string){
    //prevents the response from being cached
    noStore();
    try {
        let supabase = createClient();

        //check the user exists
        const { data, error } = await supabase.auth.getUser()
        if (error || !data?.user) {
            throw new AuthenticationError('User not found');
        };
        const user = data.user

        //delete previous instance of supabase client and start using supabase client with server role now
        supabase = createSupaServerClient();

        //check the user is part of the org and fetch the org name
        const {data: orgMembershipData, error: orgMembershipDataError} = await supabase.from("org_membership_table").select(`
        org_name: org_table!org_membership_table_org_id_fkey (org_name)
        `).eq('org_id', orgId).eq('user_id', user.id)
        if (orgMembershipDataError) {
            throw new DBError('Failed to check user membership data');
        };
        
        //if the user is not a member of the org, return
        if(!orgMembershipData){
            return new LogicValidationError('User is not a member of the org');
        };
        
        return orgMembershipData[0].org_name;
    } catch (e: any) {
        return handleError(e);
    };
};


// external - server-side function to get the current org settings based on the org id
export async function getCurrentOrgGeneralSettings(orgId: string){
    //prevents the response from being cached
    noStore();
    try {
        let supabase = createClient();

        //check the user exists
        const { data, error } = await supabase.auth.getUser()
        if (error || !data?.user) {
            throw new AuthenticationError('User not found');
        };
        const user = data.user

        //delete previous instance of supabase client and start using supabase client with server role now
        supabase = createSupaServerClient();

        //check the user is part of the org and fetch the org name
        const {data: orgMembershipData, error: orgMembershipDataError} = await supabase.from("org_membership_table").select(`
        org_name: org_table!org_membership_table_org_id_fkey (org_name, org_user_exclusivity)
        `).eq('org_id', orgId).eq('user_id', user.id)
        if (orgMembershipDataError) {
            throw new DBError('Failed to check user membership data');
        };
        
        //if the user is not a member of the org, return
        if(!orgMembershipData){
            return new LogicValidationError('User is not a member of the org');
        };
        
        return orgMembershipData[0].org_name;
    } catch (e: any) {
        return handleError(e);
    };
};


// server-side function to check if user calling this function is part of the org
export async function isUserPartOfOrg(orgID: string){
    //prevents the response from being cached
    noStore();
    try {
        let supabase = createClient()

        //check the user exists
        const { data, error } = await supabase.auth.getUser()
        if (error || !data?.user) {
            throw new AuthenticationError('User not found');
        };
        const user = data.user

        //delete prvious instance of supabase client and start using supabase client with server role now
        supabase = createSupaServerClient();

        //check if the user belongs to the org
        const {data: orgMembershipData, error: orgMembershipDataError} = await supabase.from("org_membership_table").select('org_id').eq('user_id', user.id).eq('org_id', orgID).neq('org_membership_status', 'pending');
        if (orgMembershipDataError) {
            throw new DBError('Failed to fetch org membership data');
        };

        //if the user is not a member of any orgs, return
        if(!orgMembershipData || orgMembershipData.length === 0){
            return {
                isUserPartOfOrg: false
            };
        };

        return {
            isUserPartOfOrg: true
        };
    } catch (e: any) {
        return handleError(e);
    };
};


// server-side function to check if user is part of the org by user email
export async function isUserPartOfOrgByUserEmail(orgID: string, userEmail:string){
    //prevents the response from being cached
    noStore();
    try {
        let supabase = createClient()

        //check the user exists
        const { data, error } = await supabase.auth.getUser()
        if (error || !data?.user) {
            throw new AuthenticationError('User not found');
        };

        //delete prvious instance of supabase client and start using supabase client with server role now
        supabase = createSupaServerClient();

        //check if the user belongs to the org by email
        let {data: orgMembersData, error: orgMembersDataError} = await supabase.from("org_membership_table").select(`
        org_id,
        org_membership_role,
        user_table!org_membership_table_user_id_fkey (
            user_id,
            user_email,
            user_email_status
        )
        `).eq('org_id', orgID);
        if (orgMembersDataError) {
            throw new DBError('Failed to fetch org members data');
        }

        //if the org members data is not found, return
        if(!orgMembersData || orgMembersData.length === 0){
            return { isUserPartOfOrg: false };
        };

        //filter the org members data by user email
        let userIsPartOfOrg: {orgID: string, userStatus: string, orgRole: string} | undefined;
        for(let i=0; i < orgMembersData.length; i++){
            if((orgMembersData[i].user_table as any).user_email === userEmail){
                userIsPartOfOrg = {
                    orgID: (orgMembersData[i].user_table as any).user_id,
                    userStatus: (orgMembersData[i].user_table as any).user_email_status,
                    orgRole: orgMembersData[i].org_membership_role
                };
                break;
            }
        };

        //if the user is not a member of the org, return
        if (!userIsPartOfOrg || Object.keys(userIsPartOfOrg).length === 0){
            return { isUserPartOfOrg: false };
        }

        // Return true and user details if the user is part of the org
        return {
            isUserPartOfOrg: true,
            userIDByEmail: userIsPartOfOrg.orgID,
            userStatus: userIsPartOfOrg.userStatus,
            userOrgRole: userIsPartOfOrg.orgRole
        };
    } catch (e: any) {
        return handleError(e);
    };
};


// server-side function to check if user calling this function is part of the org
export async function isUserInvitedToOrg(orgID: string){
    //prevents the response from being cached
    noStore();
    try {
        let supabase = createClient()

        //check the user exists
        const { data, error } = await supabase.auth.getUser()
        if (error || !data?.user) {
            throw new AuthenticationError('User not found');
        };
        const user = data.user

        //delete prvious instance of supabase client and start using supabase client with server role now
        supabase = createSupaServerClient();

        //check if the user belongs to the org
        const {data: orgMembershipData, error: orgMembershipDataError} = await supabase.from("org_membership_table").select('org_id').eq('user_id', user.id).eq('org_id', orgID).eq('org_membership_status', 'pending');
        if (orgMembershipDataError) {
            throw new DBError('Failed to fetch org membership data');
        };

        //if the user is not a member of any orgs, return
        if(!orgMembershipData || orgMembershipData.length === 0){
            return {
                isUserInvitedToOrg: false
            };
        };

        return {
            isUserInvitedToOrg: true
        };
    } catch (e: any) {
        return handleError(e);
    };
};


// external - server-side function to get the users in the org
export async function getUsersInOrg(orgID: string){
    //prevents the response from being cached
    noStore();
    try {
        let supabase = createClient();

        //check the user exists
        const { data, error } = await supabase.auth.getUser()
        if (error || !data?.user) {
            throw new AuthenticationError('User not found');
        };
        const user = data.user

        //delete previous instance of supabase client and start using supabase client with server role now
        supabase = createSupaServerClient();

        //check the user is part of the org 
        const {data: orgMembershipData, error: orgMembershipDataError} = await supabase.from("org_membership_table").select().eq('org_id', orgID).eq('user_id', user.id).neq('org_membership_status', 'pending');
        if (orgMembershipDataError || !orgMembershipData || orgMembershipData.length === 0) {
            throw new DBError('Failed to check user membership data');
        };
        
        //fetch the org members
        const {data: orgMembersData, error: orgMembersDataError} = await supabase.from("org_membership_table").select(`
        org_membership_role,
        org_membership_status,
        user_email: user_table!org_membership_table_user_id_fkey (user_email)
        `).eq('org_id', orgID);
        if (orgMembersDataError) {
            console.log('orgMembersDataError: ', orgMembersDataError);
            throw new DBError('Failed to fetch user members');
        };
        
        if (!orgMembersData || orgMembersData.length === 0) {
            return [];
        }
        
        //return the users that are part of the org
        let dataToReturn: {
            userEmail: any;
            userRole: any;
            userStatus: any;
        }[]  = orgMembersData.map((orgMember: any) => {
            return {
                userEmail: orgMember.user_email.user_email,
                userRole: orgMember.org_membership_role,
                userStatus: orgMember.org_membership_status
            };
        });
        return dataToReturn
    } catch (e: any) {
        return handleError(e);
    };
};

// server-side function to check if the user has the required role in the org
export async function isUserOrgRole(orgID: string, userID: string, userOrgRole: string){
    //prevents the response from being cached
    noStore();
    try {
        let supabase = createClient()

        //check the user exists
        const { data, error } = await supabase.auth.getUser()
        if (error || !data?.user) {
            throw new AuthenticationError('User not found');
        };

        //delete prvious instance of supabase client and start using supabase client with server role now
        supabase = createSupaServerClient();

        //check if the user belongs to the org
        const {data: orgMembershipData, error: orgMembershipDataError} = await supabase.from("org_membership_table").select('org_membership_role').eq('org_id', orgID).eq('user_id', userID).neq('org_membership_status', 'pending');
        if (orgMembershipDataError) {
            throw new DBError('Failed to fetch org membership data');
        };

        //if the user is not a member of the org, return
        if(!orgMembershipData || orgMembershipData.length === 0){
            return { isUserOrgRole: false };
        };

        //check if the user has the required role in the org
        if(orgMembershipData[0].org_membership_role === userOrgRole){
            return { isUserOrgRole: true };
        };

        return { isUserOrgRole: false };
    } catch (e: any) {
        return handleError(e);
    };
};


// server-side function to check if the user being removed has the last owner role in the org
export async function isUserOnlyOwnerInOrg(orgID: string, userEmail: string){
    //prevents the response from being cached
    noStore();
    try {
        let supabase = createClient()

        //check the user exists
        const { data, error } = await supabase.auth.getUser()
        if (error || !data?.user) {
            throw new AuthenticationError('User not found');
        };

        //delete prvious instance of supabase client and start using supabase client with server role now
        supabase = createSupaServerClient();

        //check if the user belongs to the org
        let {data: orgMembersData, error: orgMembersDataError} = await supabase.from("org_membership_table").select(`
        org_membership_role,
        user_email: user_table!org_membership_table_user_id_fkey (user_email)
        `).eq('org_id', orgID);
        if (orgMembersDataError) {
            throw new DBError('Failed to fetch org members data');
        }

        //if the org members data is not found, return
        if(!orgMembersData || orgMembersData.length === 0){
            return { isUserOnlyOwnerInOrg: false };
        };
  
        //check if the user is part of the org and has the 'owner' role
        let userIsOwner = false;
        let ownerCount = 0;
    
        for (let i = 0; i < orgMembersData.length; i++) {
            if ((orgMembersData[i].user_email as any).user_email === userEmail && orgMembersData[i].org_membership_role === 'owner') {
            userIsOwner = true;
            }
            if (orgMembersData[i].org_membership_role === 'owner') {
            ownerCount++;
            }
        }
    
        //check if the user is the only owner in the org
        if (userIsOwner && ownerCount === 1) {
            return { isUserOnlyOwnerInOrg: true };
        }
    
        return { isUserOnlyOwnerInOrg: false };
    } catch (e: any) {
        return handleError(e);
    };
}

// external - server-side function to get the user permissions in the org
export async function getCurrentOrgUserPermissions(orgId: string){
    //prevents the response from being cached
    noStore();
    try {
        let supabase = createClient();

        //check the user exists
        const { data, error } = await supabase.auth.getUser()
        if (error || !data?.user) {
            throw new AuthenticationError('User not found');
        };
        const user = data.user

        //delete previous instance of supabase client and start using supabase client with server role now
        supabase = createSupaServerClient();

        //check the user is part of the org and fetch the org name
        const {data: orgMembershipData, error: orgMembershipDataError} = await supabase.from("org_membership_table").select(`
        org_user_permissions: org_table!org_membership_table_org_id_fkey (org_user_exclusivity)
        `).eq('org_id', orgId).eq('user_id', user.id)
        if (orgMembershipDataError) {
            throw new DBError('Failed to check user membership data');
        };
        
        //if the user is not a member of the org, return
        if(!orgMembershipData){
            return new LogicValidationError('User is not a member of the org');
        };
        
        return {
            orgUserExclusivity: (orgMembershipData[0] as any).org_user_permissions.org_user_exclusivity
        }
    } catch (e: any) {
        return handleError(e);
    };
};


export async function doesOrgHaveUserExclusivity(orgID: string){
    //prevents the response from being cached
    noStore();
    try {
        let supabase = createClient();

        //delete previous instance of supabase client and start using supabase client with server role now
        supabase = createSupaServerClient();

        //fetch the org members
        const {data: orgData, error: orgDataError} = await supabase.from("org_table").select(`
        org_user_exclusivity
        `).eq('org_id', orgID);
        if (orgDataError) {
            throw new DBError('Failed to fetch org data');
        };
        
        //if the org data is not found, return
        if(!orgData || orgData.length === 0){
            return new LogicValidationError('Org not found');
        };
        
        return {
            orgUserExclusivity: orgData[0].org_user_exclusivity
        };
    } catch (e: any) {
        return handleError(e);
    };
};


//
export async function doUsersInOrgBelongToOtherOrgs(orgID: string){
    //prevents the response from being cached
    noStore();
    try {
        let supabase = createClient();

        //delete previous instance of supabase client and start using supabase client with server role now
        supabase = createSupaServerClient();

        //fetch the org members
        const {data: orgMembersData, error: orgMembersDataError} = await supabase.from("org_membership_table").select(`
        user_id,
        user_email: user_table!org_membership_table_user_id_fkey (user_email)
        `).eq('org_id', orgID);
        if (orgMembersDataError) {
            throw new DBError('Failed to fetch org members data');
        };

        //if the org members data is not found, return
        if(!orgMembersData || orgMembersData.length === 0){
            return new LogicValidationError('Org members not found');
        };

        //check if the users in the org belong to other orgs
        let usersBelongToOtherOrgs: {userID: string, userEmail: string}[] = [];
        for(let i=0; i < orgMembersData.length; i++){
            let {data: orgMembershipData, error: orgMembershipDataError} = await supabase.from("org_membership_table").select(`
            org_id
            `).eq('user_id', orgMembersData[i].user_id).neq('org_id', orgID).eq('org_membership_status', 'confirmed');
            if (orgMembershipDataError) {
                throw new DBError('Failed to fetch org membership data');
            };

            if(orgMembershipData && orgMembershipData.length > 0){
                usersBelongToOtherOrgs.push({
                    userID: orgMembersData[i].user_id,
                    userEmail: (orgMembersData[i] as any).user_email.user_email
                });
            };
        };

        return usersBelongToOtherOrgs;
    } catch (e: any) {
        return handleError(e);
    };
};


// server side function to check the user is not trying to remove themselves if they are the only user in the trip 
// or if the are the only confirmed user in the trip
export async function isUserRemovingThemselves(orgID: string, userID: string){
    //prevents the response from being cached
    noStore();
    try {
        let supabase = createClient()

        //check the user exists
        const { data, error } = await supabase.auth.getUser()
        if (error || !data?.user) {
            throw new AuthenticationError('User not found');
        };
        const user = data.user

        //delete prvious instance of supabase client and start using supabase client with server role now
        supabase = createSupaServerClient();

        //fetch the org members
        const {data: orgMembersData, error: orgMembersDataError} = await supabase
        .from("org_membership_table")
        .select(`
        org_membership_role, 
        org_membership_status, 
        user_table!org_membership_table_user_id_fkey (user_id)
        `)
        .eq('org_id', orgID)

        //if the trip members data is not found, return
        if(!orgMembersData || orgMembersData.length === 0 || orgMembersDataError){
            throw new DBError('Failed to fetch org members');
        };

        // Process org members data
        let orgMembers: {userID: string, orgMembershipStatus: string, orgRole: string}[] = orgMembersData.map(orgMember => ({
            userID: (orgMember.user_table as any).user_id,
            orgMembershipStatus: orgMember.org_membership_status,
            orgRole: orgMember.org_membership_role
        }));
        //console.log('orgMembers: ', orgMembers);

        // Check if the user is the only user or the only confirmed user in the org
        if (orgMembers.length === 1 && orgMembers[0].userID === user.id) {
            return true;
        }

        //if the user is trying to delete themselves and they are the only confirmed user in the org, return
        if(orgMembers.length > 1){
            let confirmedUsers = orgMembers.filter((orgMember) => orgMember.orgMembershipStatus === 'confirmed');
            //console.log('confirmedUsers: ', confirmedUsers);
            if(confirmedUsers.length === 1 && user.id === userID){
                return true;
            };
        };

        return false;
    } catch (e: any) {
        return handleError(e);
    };
};
//---------------------------------------------------------------------


//---------------------------------------------------------------------
// Server-side functions related to notifications

// server side function to get all notifications for the user
export async function getAllNotifications(){
    //prevents the response from being cached
    noStore();
    try {
        let orgInvitationNotifications = await getOrgInvitationNotifications();

        return {
            orgInvitationNotifications,
        };
    } catch (e: any) {
        return handleError(e);
    };
};


// server-side function to get org invitations for the user
interface OrgInvitationNotifications {
    id: string;
    type: string;
    invitedBy: {email: string};
};
export async function getOrgInvitationNotifications(){
    //prevents the response from being cached
    noStore();
    try {
        let supabase = createClient()

        //check the user exists
        const { data, error } = await supabase.auth.getUser()
        if (error || !data?.user) {
            throw new AuthenticationError('User not found');
        };
        const user = data.user

        //delete previous instance of supabase client and start using supabase client with server role now
        supabase = createSupaServerClient();

        //fetch the trip invitations for the user
        const {data: orgMembershipData, error: orgMembershipDataError} = await supabase.from("org_membership_table").select(`
        org_id,
        org_name: org_table!org_membership_table_org_id_fkey (org_name),
        invitedBy: user_table!org_membership_table_invited_by_fkey (user_email)
        `).eq('user_id', user.id).eq('org_membership_status', 'pending');
        if (orgMembershipDataError) {
            throw new DBError('Failed to fetch org membership data');
        };
        
        //if the user is not a member of any org, return
        if(!orgMembershipData || orgMembershipData.length === 0){
            return [];
        };

        //transform the tripMembershipData into an array of trip_ids
        const orgInvitationsNotifications: OrgInvitationNotifications[] = orgMembershipData.map((orgMD) => {
            return (
                {
                    id: orgMD.org_id,
                    orgName: (orgMD as any).org_name.org_name,
                    type: 'invitation',
                    invitedBy: (orgMD.invitedBy as any).user_email
                }
            )
        });
        
        return orgInvitationsNotifications;
    } catch (e: any) {
        return handleError(e);
    };
};
//---------------------------------------------------------------------