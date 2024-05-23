"use client"

import { editOrgUserSettings } from "@/utils/actions";
import * as Switch from '@radix-ui/react-switch';
import FormButtonAbstraction from "../miscelaneous/formButtonAbstraction";
import { useState } from "react";
import { useFormState } from "react-dom";
import { useEffect } from "react";
import toast, { Toaster } from 'react-hot-toast';

export default function FormEditOrgUserSettings( {orgID, orgExclusivity}: {orgID: string, orgExclusivity: boolean} ) {
  const [state, formAction] = useFormState(editOrgUserSettings, '')
  const [orgExclusivityState, setOrgExclusivityState] = useState(orgExclusivity);

  useEffect(() => {
    if (state.success === false) {
      toast.error(state.error.message + ' - ' + state.error.code)
    }
    if (state.success === true) {
      toast.success("The user exclusivity has been updated!");
    }
  }, [state.success, state.error, state.successID]);

  return (
    <form action={formAction} className='w-1/2 flex flex-col gap-4'>
      <div className='flex flex-col gap-2 font-medium text-sm text-neutral-800'>
        <p className="text-sm font-medium text-neutral-900">Organization Users Settings</p>
        <div className="flex flex-row gap-2 items-center">
          <input type="hidden" name="orgID" value={orgID}/>
          <label htmlFor="orgName">Users can only be part of this organization</label>
          <Switch.Root
            className="relative w-[40px] h-[24px] rounded-full border-2 border-neutral-400"
            id="orgName"
            checked={orgExclusivityState}
            onCheckedChange={(ch) => {
              setOrgExclusivityState(ch);
            }}
          >
            <Switch.Thumb className="block w-[16px] h-[14px] bg-neutral-700 rounded-full transition-transform duration-150 translate-x-1 will-change-transform data-[state=checked]:translate-x-[16px]" />
          </Switch.Root>
          <input type="hidden" name="orgUserExclusivity" value={String(orgExclusivityState)}/>
        </div>
      </div>
      <FormButtonAbstraction buttonText="Update" loadingText="Loading..."/>
      <Toaster/>
    </form>
  )
}