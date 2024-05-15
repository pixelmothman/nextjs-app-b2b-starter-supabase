'use client'

import { useSearchParams } from "next/navigation";

export default function DashboardErrorPage(){
    const searchParams = useSearchParams();
    const errorMessage = searchParams.get('error_message');
    const errorCode = searchParams.get('error_code');
    const errorDetails = searchParams.get('error_details');

    return (
        <div className="w-full h-full flex flex-col gap-4 items-center justify-center">
            <div className="w-full flex flex-col gap-2 items-center justify-center">
                <h1 className="text-2xl font-bold text-neutral-900">Error: {errorCode}</h1>
                <p className="text-sm font-medium text-neutral-800">{errorMessage}</p>
                <p className="text-xs font-normal text-neutral-700">{errorDetails}</p>
            </div>
        </div>
    )
};