'use client'

import { useSearchParams } from "next/navigation";
import { useRouter } from 'next/navigation'

export default function TripErrorPage(){
    const searchParams = useSearchParams();
    const errorMessage = searchParams.get('error_message');
    const errorCode = searchParams.get('error_code');
    const errorDetails = searchParams.get('error_details');
    const router = useRouter();

    return (
        <div className="w-full h-full flex justify-center mt-64">
            <div className="w-full h-fit flex flex-col gap-2 items-center justify-center">
                <h1 className="text-2xl font-bold text-neutral-900">Error: {errorCode}</h1>
                <p className="text-sm font-medium text-neutral-800">{errorMessage}</p>
                <p className="text-xs font-normal text-neutral-700">{errorDetails}</p>
                <button onClick={() => router.push('/dashboard')} className="mt-2 px-4 py-2 bg-neutral-800 text-xs font-normal text-neutral-50 rounded-md hover:outline hover:outline-2 hover:outline-neutral-400">
                    Try again
                </button>
            </div>
        </div>
    )
};