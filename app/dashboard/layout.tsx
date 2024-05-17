"use server"

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { type ReactNode } from 'react';

export default async function DashboardLayout( {children}: {children: ReactNode} ) {
    const supabase = createClient();

    // if the user is not logged in, redirect to the login page
    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        redirect('/');
    };

    return (
        <div className="h-full pb-16 bg-neutral-200">
            {children}
        </div>
    )
};