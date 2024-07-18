'use client'

import { addOrgToDeleteQueue } from "@/utils/actions";
import FormButtonAbstraction from "../miscelaneous/formButtonAbstraction";

export default function DeleteOrgBtn({orgID}: {orgID: string}){

    return (
        <form action={addOrgToDeleteQueue} className="flex flex-col gap-4">
            <input type="hidden" name="orgID" value={orgID}/>
            <FormButtonAbstraction buttonText="Delete Organization" loadingText="Loading..."/>
        </form>
    )
};