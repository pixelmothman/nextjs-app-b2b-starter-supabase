import { getCurrentOrgName } from "@/utils/data"
import { redirect } from "next/navigation";

export default async function CurrentOrgIndicator({orgID}: {orgID: string}){
    const orgName = await getCurrentOrgName(orgID);
    // Check if the response is an error
    if ('error' in orgName) {
        redirect(`/dashboard/${orgID}/error?error_message=${orgName.error.message}&error_code=${orgName.error.code}&error_details=${orgName.error.details}`)
    };
    return (
        <p className="font-bold text-xs text-neutral-700">{orgName.org_name}</p>
    )
};