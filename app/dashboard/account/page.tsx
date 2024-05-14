import FormEditAccount from "@/components/account/formEditAccount";
import { createClient } from "@/utils/supabase/server";


export default async function AccountPage(){
    const supabase = createClient();
    const { data, error } = await supabase.auth.getUser()

    return (
        <div className="w-full h-full flex flex-col justify-between gap-4 p-5 rounded-sm bg-white border border-neutral-800 shadow-sm">
            <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold text-neutral-900">Account</h1>
                </div>
                {
                    error && 'error' in error ? (
                        <p className="text-neutral-800 mb-4">
                        There was an error loading your account information.
                        </p>
                    ) : data.user?.email !== undefined && (
                        <FormEditAccount userEmail={data.user?.email}/>
                    )
                }
                
            </div>
        </div>
    )
};