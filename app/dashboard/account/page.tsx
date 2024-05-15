import FormEditAccount from "@/components/account/formEditAccount";
import GoBackFromAccount from "@/components/account/goBackFromAccount";
import { createClient } from "@/utils/supabase/server";


export default async function AccountPage({searchParams}: {searchParams: URLSearchParams}){
    const supabase = createClient();
    const { data, error } = await supabase.auth.getUser()
    
    let newEmailNotConfirmed;
    if(Object.keys(searchParams).length > 0){
        newEmailNotConfirmed = searchParams.new_email_not_confirmed
    }

    return (
        <div className="relative w-full h-full flex justify-center items-center">
            <GoBackFromAccount/>
            <div className="w-96 h-1/2 p-6 bg-neutral-50 shadow-[0px_0px_4px_2px_rgba(0,0,0,0,3)] shadow-neutral-300 rounded-sm overflow-hidden">
                <div className="flex flex-col gap-2 overflow-y-auto">
                    <h1 className="text-2xl font-bold text-neutral-900">Account</h1>
                    <p className='text-sm font-medium text-neutral-600'>
                    Your account information.
                    </p>
                    {
                    error && 'error' in error ? (
                        <p className="text-neutral-800 mb-4">
                        There was an error loading your account information.
                        </p>
                    ) : data.user?.email !== undefined && (
                        <div className="w-full h-fit flex flex-col gap-2 mt-2">
                            {
                                newEmailNotConfirmed === 'true' ? (
                                    <div className='w-full p-2 bg-blue-200 border-2 border-blue-400 rounded-md'>
                                        <p className="font-semibold text-xs text-neutral-800">
                                            You still need to confirm your new email address. Check you email for a confirmation link.
                                        </p>
                                    </div>
                                ) : null
                            }
                            <FormEditAccount userEmail={data.user?.email}/>
                        </div>
                    )
                }
                </div>
            </div>
        </div>
    )
};