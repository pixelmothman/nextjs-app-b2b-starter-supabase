import { getOrgs } from '@/utils/data';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function Page(){
    //if the user does not belong to an organization, redirect to the organization creation page
    const isInOrg = await getOrgs();
    // Check if the response is an error
    if ('error' in isInOrg!) {
        redirect(`/org/error?error_message=${isInOrg.error.message}&error_code=${isInOrg.error.code}&error_details=${isInOrg.error.details}`)      
    } else if (!isInOrg || isInOrg.length === 0) {
        redirect('/org/create');
    };
    return (
        <div className="w-full h-full flex justify-center items-center">
            <div className="w-96 h-1/2 p-6 bg-neutral-50 shadow-[0px_0px_4px_2px_rgba(0,0,0,0,3)] shadow-neutral-300 rounded-sm overflow-hidden">
                <div className="flex flex-col gap-2 overflow-y-auto">
                    <h1 className="text-2xl font-bold text-neutral-900">Organizations</h1>
                    <p className='text-sm font-medium text-neutral-600'>
                        Please select an organization.
                    </p>
                    {
                        isInOrg && isInOrg.length > 0 ? (
                            <div className="w-full h-fit flex flex-col gap-2 mt-2">
                                {
                                    isInOrg.map((org) => (
                                        <Link href={`/dashboard/${org.org_id}`} key={org.org_id} className="w-full h-fit flex flex-row gap-2 items-center justify-between p-2 bg-neutral-50  hover:bg-neutral-200 border-2 border-neutral-300 rounded-md cursor-pointer">
                                            <p className="text-sm font-medium text-neutral-900">{org.org_name.org_name}</p>
                                            <svg className="fill-neutral-800" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256"><path d="M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm48.49-92.49a12,12,0,0,1,0,17l-32,32a12,12,0,1,1-17-17L139,140H88a12,12,0,0,1,0-24h51l-11.52-11.51a12,12,0,1,1,17-17Z"></path></svg>
                                        </Link>
                                    ))
                                }
                            </div>
                        ) : (
                            <p className="text-neutral-800">
                                You do not belong to any organizations.
                            </p>
                        )
                    }
                </div>
            </div>
        </div>
    )
}