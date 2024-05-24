"use client"

import FormButtonAbstraction from "../miscelaneous/formButtonAbstraction";
import { signup } from '@/utils/actions'
import { useState } from "react";
import { useFormState } from "react-dom";
import { useEffect } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { ErrorResponse } from "@/utils/errorHandler";

export default function FormSignUp({setIsLogin}: {setIsLogin: Function}) {
  const [state, formAction] = useFormState(signup, '')
  const [newEmail, setNewEmail] = useState('');

  useEffect(() => {
    if (state.success === false) {
      toast.error((state as ErrorResponse).error.message + ' - ' + (state as ErrorResponse).error.code)
    }
    if (state.success === true) {
      toast.success('Please check your email for the login link.');
    }
  }, [state.success, (state as ErrorResponse).error]);

  return (
    <form action={formAction} className='w-full flex flex-col gap-4'>
      <div className='flex flex-col font-medium text-sm text-neutral-800'>
        <label htmlFor="signupEmail">Email:</label>
        <input onChange={(e) => {
          setNewEmail(e.target.value);
        }} value={newEmail} className="w-full px-4 py-2 bg-neutral-50 border border-neutral-300 rounded-md" id="signupEmail" name="signupEmail" type="email" required />
      </div>
      <div className="flex flex-col gap-2">
        <FormButtonAbstraction buttonText="Sign Up" loadingText="Loading..."/>
        <button onClick={() => setIsLogin(true)} className='mt-4 font-medium text-sm text-neutral-800 hover:text-neutral-900 hover:underline'>
          Want to log in?
        </button>
      </div>
      <Toaster/>
    </form>
  )
}