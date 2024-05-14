'use server'

import { unstable_noStore as noStore } from "next/cache";
import { createClient } from '@/utils/supabase/server'
import { createSupaServerClient } from "./supabase/superServer";
import { AuthenticationError, DBError, LogicValidationError } from './customErrorClasses';
import { ErrorResponse, handleError } from "./errorHandler";

//---------------------------------------------------------------------
// Server-side functions related to orgs

// server-side function to get orgs that the user is part of
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

        //fetch the orgs that the user is part of
        const {data: orgMembershipData, error: orgMembershipDataError} = await supabase.from("org_membership_table").select().eq('user_id', user.id)
        if (orgMembershipDataError) {
            throw new DBError('Failed to fetch org membership data');
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
//---------------------------------------------------------------------