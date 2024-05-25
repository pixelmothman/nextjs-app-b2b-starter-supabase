import { getCurrentOrgName } from "@/utils/data"
import { ErrorResponse } from "@/utils/errorHandler";
import { redirect } from "next/navigation";

export default async function CurrentOrgIndicator({orgID}: {orgID: string}){
    const orgName = await getCurrentOrgName(orgID);
    // Check if the response is an error
    if ('error' in orgName || !('org_name' in orgName)) {
        redirect(`/dashboard/${orgID}/error?error_message=${(orgName as ErrorResponse).error.message}&error_code=${(orgName as ErrorResponse).error.code}&error_details=${(orgName as ErrorResponse).error.details}`)
    };
    return (
        <p className="font-bold text-xs text-neutral-700">{orgName.org_name}</p>
    )
};