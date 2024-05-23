import FormEditOrgName from "@/components/org/formEditOrgName";
import FormEditOrgUserSettings from "@/components/org/formEditOrgUserSettings";
import { getCurrentOrgGeneralSettings, isUserOrgRole } from "@/utils/data";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function SettingsGeneralPage({params}: {params: {orgID: string}}){
    const supabase = createClient();
    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        redirect('/');
    };
    const orgGeneralSettings = await getCurrentOrgGeneralSettings(params.orgID);
    // Check if the response is an error
    if ('error' in orgGeneralSettings) {
        redirect(`/dashboard/${params.orgID}/error?error_message=${orgGeneralSettings.error.message}&error_code=${orgGeneralSettings.error.code}&error_details=${orgGeneralSettings.error.details}`)
    };
    const isUserOwnerRole = await isUserOrgRole(params.orgID, data?.user?.id, 'owner');
    // Check if the response is an error
    if ('error' in isUserOwnerRole) {
        redirect(`/dashboard/${params.orgID}/error?error_message=${isUserOwnerRole.error.message}&error_code=${isUserOwnerRole.error.code}&error_details=${isUserOwnerRole.error.details}`)
    };
    return (
        <div className="w-full h-fit flex flex-col gap-2 p-1">
            {
                isUserOwnerRole.isUserOrgRole === true ? (
                    <>
                        <FormEditOrgName orgID={params.orgID} orgName={orgGeneralSettings.org_name}/>
                        <FormEditOrgUserSettings orgID={params.orgID} orgExclusivity={orgGeneralSettings.org_user_exclusivity}/>
                    </>
                ) : (
                    <div className='flex flex-col gap-2'>
                        <span>Organization Name</span>
                        <div className="max-w-96 px-4 py-2 shadow-[inset_0px_0px_4px_1px_rgba(0,0,0,0,3)] shadow-neutral-200 rounded-md outline-none focus:ring-2 focus:ring-neutral-900">
                            <span className="font-medium text-sm text-neutral-800">
                            {orgGeneralSettings.org_name}
                            </span>
                        </div>
                    </div>
                )
            }
        </div>
    )
};