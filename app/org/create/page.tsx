import FormCreateFirstOrg from "@/components/org/formCreateFirstOrg";
import { getOrgs } from "@/utils/data";
import { redirect } from "next/navigation";

export default async function CreateOrgPage(){

    const isUserPartOfOrg = await getOrgs();
    if ('error' in isUserPartOfOrg!) {
        redirect(`/org/error?error_message=${isUserPartOfOrg.error.message}&error_code=${isUserPartOfOrg.error.code}&error_details=${isUserPartOfOrg.error.details}`)      
    };
    if (isUserPartOfOrg.length > 0) {
        redirect(`/dashboard`);
    };

    return (
        <div className="w-full h-full flex justify-center mt-64">
            <div className="w-96 h-fit">
                <FormCreateFirstOrg/>
            </div>
        </div>
    )
};