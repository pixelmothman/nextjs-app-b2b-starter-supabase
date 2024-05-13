"use client"

import FormButtonAbstraction from "../miscelaneous/formButtonAbstraction";
import { createOrg } from '@/utils/actions'
import { useFormState } from "react-dom";
import { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';

export default function FormCreateOrg() {
  const [state, formAction] = useFormState(createOrg, '')
  const [orgNameLength, setOrgNameLength] = useState(0)

  useEffect(() => {
    if (state.success === false) {
      toast.error(state.error.message + ' - ' + state.error.code)
    }
    if (state.success === true) {
      toast.success('Organization created successfully.');
    }
  }, [state.success, state.error, state.successID]);

  return (
    <form action={formAction} className='w-full flex flex-col gap-4'>
        <div className='flex flex-col gap-2 font-medium text-sm text-neutral-800'>
          <div className="flex flex-row justify-between items-center pr-1">
            <label htmlFor="orgName">Organization Name</label>
            <span className={`text-xs ${orgNameLength >= 40 ? 'text-red-500' : 'text-neutral-800'} font-semibold mt-1 `}>{orgNameLength} / 40</span>
          </div>
          <input onChange={
              (e) => {
                setOrgNameLength(e.target.value.length)
              }
          }className="w-full px-4 py-2 bg-neutral-50 border border-neutral-300 rounded-md" id="orgName" name="orgName" type="text" min={3} max={40} required />
        </div>
        <FormButtonAbstraction buttonText="Create" loadingText="Loading..."/>
        <Toaster/>
    </form>
  )
}