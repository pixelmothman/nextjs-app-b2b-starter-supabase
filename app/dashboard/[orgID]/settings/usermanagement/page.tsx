import UserManagementClient from "@/components/org/userManagementClient";
import { getUsersInOrg } from "@/utils/data";
import { redirect } from "next/navigation";

export default async function UserManagementPage({params}: {params: {orgID: string}}){
    const theUsersInTheOrg = await getUsersInOrg(params.orgID);
    if ('error' in theUsersInTheOrg) {
        redirect(`/dashboard/${params.orgID}/settings/error?error_message=${theUsersInTheOrg.error.message}&error_code=${theUsersInTheOrg.error.code}&error_details=${theUsersInTheOrg.error.details}`)      
    }
    return (
        <UserManagementClient orgID={params.orgID} theUsersInTheOrg={theUsersInTheOrg}/>
    )
};