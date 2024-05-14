import FormEditAccount from "@/components/account/formEditAccount";
import { createClient } from "@/utils/supabase/server";


export default async function AccountPage(){
    const supabase = createClient();
    const { data, error } = await supabase.auth.getUser()

    return (
        <div className="w-full h-full flex justify-center mt-64">
            <div className="w-96 h-fit p-6 bg-neutral-50 shadow-[0px_0px_4px_2px_rgba(0,0,0,0,3)] shadow-neutral-300 rounded-sm">
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