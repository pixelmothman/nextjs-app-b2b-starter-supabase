"use client"

import { editAccountEmail } from "@/utils/actions";
import FormButtonAbstraction from "../miscelaneous/formButtonAbstraction";
import { useState } from "react";
import { useFormState } from "react-dom";
import { useEffect } from "react";
import toast, { Toaster } from 'react-hot-toast';

export default function FormEditAccount( {userEmail}: {userEmail: string}) {
  const [state, formAction] = useFormState(editAccountEmail, userEmail)
  const [newEmail, setNewEmail] = useState(userEmail);

  useEffect(() => {
    if (state.success === false) {
      toast.error(state.error.message + ' - ' + state.error.code)
    }
    if (state.success === true) {
      toast.success('Your email has not updated yet. Check both your old and new email for a confirmation link.');
    }
  }, [state.success, state.error]);

  return (
    <form action={formAction} className='w-1/2 flex flex-col gap-2'>
      <div className='flex flex-col font-medium text-sm text-neutral-800'>
        <label htmlFor="accountEmail">Email:</label>
        <input onChange={(e) => {
          setNewEmail(e.target.value);
        }} value={newEmail} className="w-full px-4 py-2 bg-neutral-100 rounded-md" id="accountEmail" name="accountEmail" type="email" required />
      </div>
      <FormButtonAbstraction buttonText="Update email" loadingText="Loading..."/>
      <Toaster/>
    </form>
  )
}