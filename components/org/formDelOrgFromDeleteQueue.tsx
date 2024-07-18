'use client'

import { delOrgFromDeleteQueue } from "@/utils/actions";
import FormButtonAbstraction from "../miscelaneous/formButtonAbstraction";

export default function CancelDeleteOrgBtn( {orgID}: {orgID: string} ){
    return (
        <form action={delOrgFromDeleteQueue} className="flex flex-col gap-4">
            <input type="hidden" name="orgID" value={orgID}/>
            <FormButtonAbstraction buttonText="Cancel Organization Deletion" loadingText="Loading..."/>
        </form>
    )
};