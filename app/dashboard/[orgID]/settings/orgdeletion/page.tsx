import DeleteOrgBtn from "@/components/org/formAddOrgToDeleteQueue";
import CancelDeleteOrgBtn from "@/components/org/formDelOrgFromDeleteQueue";
import { getIsOrgInDeleteQueue } from "@/utils/data";
import { redirect } from "next/navigation";

export default async function OrgDeletionPage({params}: {params: {orgID: string}}){
    const isOrgInDeleteQueue = await getIsOrgInDeleteQueue(params.orgID);
    if ('error' in isOrgInDeleteQueue) {
        redirect(`/dashboard/${params.orgID}/error?error_message=${isOrgInDeleteQueue.error.message}&error_code=${isOrgInDeleteQueue.error.code}&error_details=${isOrgInDeleteQueue.error.details}`)
    };

    return (
        <div className="w-full h-full flex flex-col gap-2 p-1">
            <div className="w-full h-fit flex flex-col gap-2">
                <h2 className="font-medium text-sm text-neutral-800">
                Delete Organization
                </h2>
                {
                    isOrgInDeleteQueue.isOrgInDeleteQueue === false ? (
                        <p className="font-neutral text-sm text-neutral-800">
                        If you click the delete org button, the organization will be added to the delete queue and deleted at midnight.
                        </p>
                    ) : (
                        <p className="font-neutral text-sm text-neutral-800">
                        The organization will be deleted tonight at midnight.
                        </p>
                    )
                }
            </div>
            {
                isOrgInDeleteQueue.isOrgInDeleteQueue === false ? (
                    <DeleteOrgBtn orgID={params.orgID}/>
                ) : (
                    <CancelDeleteOrgBtn orgID={params.orgID}/>
                )
            }

        </div>
    )
};