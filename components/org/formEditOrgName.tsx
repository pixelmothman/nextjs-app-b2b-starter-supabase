"use client"

import { editOrgName } from "@/utils/actions";
import FormButtonAbstraction from "../miscelaneous/formButtonAbstraction";
import { useState } from "react";
import { useFormState } from "react-dom";
import { useEffect } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { ReturnEditOrgNameData } from "@/utils/interfacesForActions";
import { ErrorResponse } from "@/utils/errorHandler";

export default function FormEditOrgName( {orgID, orgName}: {orgID: string, orgName: string} ) {
  const [state, formAction] = useFormState(editOrgName, '')
  const [orgNameState, setOrgNameState] = useState(orgName);

  useEffect(() => {
    if (state.success === false) {
      toast.error((state as ErrorResponse).error.message + ' - ' + (state as ErrorResponse).error.code)
    }
    if (state.success === true) {
      toast.success('Your organization name has been updated!');
    }
  }, [state.success, (state as ErrorResponse).error, (state as ReturnEditOrgNameData).successID]);

  return (
    <form action={formAction} className='w-1/2 flex flex-col gap-4'>
      <div className='flex flex-col gap-2 font-medium text-sm text-neutral-800'>
        <input type="hidden" name="orgID" value={orgID}/>
        <label htmlFor="orgName">Organization Name</label>
        <input onChange={(e) => {
          setOrgNameState(e.target.value);
        }} value={orgNameState} className="w-full px-4 py-2 shadow-[inset_0px_0px_4px_1px_rgba(0,0,0,0,3)] shadow-neutral-200 rounded-md outline-none focus:ring-2 focus:ring-neutral-900" id="orgName" name="orgName" type="text" min={3} max={40} required />
      </div>
      <FormButtonAbstraction buttonText="Update" loadingText="Loading..."/>
      <Toaster/>
    </form>
  )
}