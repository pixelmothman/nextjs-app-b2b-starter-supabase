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

        //fetch the trip ids of the trips that the user is part of
        const {data: orgMembershipData, error: orgMembershipDataError} = await supabase.from("trip_membership_table").select('trip_id').eq('user_id', user.id).neq('status', 'pending');
        if (tripMembershipDataError) {
            throw new DBError('Failed to fetch trip membership data');
        }
        
        //if the user is not a member of any trips, return
        if(!tripMembershipData || tripMembershipData.length === 0){
            return [];
        };
        
        return tripsData;
    } catch (e) {
        return handleError(e);
    };
};
//---------------------------------------------------------------------