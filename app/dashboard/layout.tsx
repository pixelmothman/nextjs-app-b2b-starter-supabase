"use server"

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { type ReactNode } from 'react';
import DashboardHeader from '@/components/dashboard/dashboardHeader';
import { getOrgs } from '@/utils/data';

export default async function DashboardLayout( {children}: {children: ReactNode} ) {
    const supabase = createClient();

    // if the user is not logged in, redirect to the login page
    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        redirect('/');
    };

    //if the user does not belong to an organization, redirect to the organization creation page
    const isInOrg = await getOrgs();
    // Check if the response is an error
    if ('error' in isInOrg!) {
        redirect(`/org/error?error_message=${isInOrg.error.message}&error_code=${isInOrg.error.code}&error_details=${isInOrg.error.details}`)      
    };
    if (!isInOrg || isInOrg.length === 0) {
        redirect('/org/create');
    };

    return (
        <div className="w-full h-full flex-col bg-neutral-100 overflow-hidden">
            <DashboardHeader/>
            <div className="w-full h-full flex flex-row">
            {children}
            </div>
        </div>
    )
};