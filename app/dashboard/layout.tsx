import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { type ReactNode } from 'react';
import DashboardHeader from '@/components/dashboard/dashboardHeader';

export default async function DashboardLayout( {children, create_first_org}: {children: ReactNode, create_first_org: ReactNode} ) {
    const supabase = createClient();

    // if the user is not logged in, redirect to the login page
    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        redirect('/')
    };

    //if the user does not belong to an organization, redirect to the organization creation page
    let showCreateFirstOrg = false;
    const { data: userOrgsData, error: userOrgsDataError } = await supabase.from('org_membership_table').select('org_id, org_name').eq('user_id', data?.user.id);
    if (userOrgsDataError || !userOrgsData || userOrgsData.length === 0) {
        showCreateFirstOrg = true;
    };

    return (
        <div className="w-full h-full flex-col bg-neutral-100 overflow-hidden">
            <DashboardHeader/>
            {
                showCreateFirstOrg ? create_first_org : null
            }
            <div className="w-full h-full flex flex-row">
            {children}
            </div>
        </div>
    )
};