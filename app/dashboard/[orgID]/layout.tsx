"use server"

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Suspense, type ReactNode } from 'react';
import { getOrgs } from '@/utils/data';
import CurrentOrgIndicator from '@/components/org/currentOrgIndicator';
import MainMenuDD from '@/components/dashboard/mainMenuDD';
import OrgsPopover from '@/components/org/orgsPopover';

export default async function DashboardLayout( {children, params}: {children: ReactNode, params: any} ) {
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
            <div className='w-full h-fit flex flex-row justify-between px-4 py-4 border-b border-neutral-300'>
                <div className="w-fit flex flex-row gap-2 items-center justify-center">
                    <span className="font-black text-base text-neutral-900">
                        nextjs-app-b2b-starter-supabase
                    </span>
                    <div className="w-[2px] h-4 bg-neutral-400 -skew-x-12"/>
                    <div className="flex flex-row gap-[6px] items-center justify-center">
                        <Suspense>
                            <CurrentOrgIndicator orgID={params.orgID}/>
                        </Suspense>
                        <OrgsPopover orgs={isInOrg}/>
                    </div>
                </div>
                <MainMenuDD/>
            </div>
            <div className="w-full h-full flex flex-row">
            {children}
            </div>
        </div>
    )
};