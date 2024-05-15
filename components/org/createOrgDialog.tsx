"use client"

import * as Dialog from '@radix-ui/react-dialog';
import FormButtonAbstraction from "../miscelaneous/formButtonAbstraction";
import { createOrg } from '@/utils/actions'
import { useFormState } from "react-dom";
import { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';

export default function CreateOrgDialog(){
    const [state, formAction] = useFormState(createOrg, '')
    const [orgNameLength, setOrgNameLength] = useState(0)

    useEffect(() => {
        if (state.success === false) {
        toast.error(state.error.message + ' - ' + state.error.code)
        }
    }, [state.success, state.error, state.successID]);

    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <button className="group relative flex flex-row gap-2 items-center justify-center h-6 bg-white text-xs font-semibold text-neutral-900 hover:text-neutral-100 focus:text-neutral-100 border border-neutral-800 outline-none rounded-md cursor-pointer hover:bg-neutral-900 outline-0 focus:bg-neutral-900">
                    Create organization
                </button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className='fixed inset-0 bg-neutral-900 bg-opacity-50'/>
                <Dialog.Content className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-fit p-6 bg-neutral-50 shadow-[0px_0px_2px_2px_rgba(0,0,0,0,3)] shadow-neutral-500 rounded-md overflow-hidden'>
                    <div className='flex flex-col gap-2'>
                        <span className='text-base font-semibold text-neutral-900'>
                            Create Organization
                        </span>
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
                            } required type="text" min={3} max={40} autoComplete="off"  className="w-full px-4 py-2 bg-neutral-50 border border-neutral-300 rounded-md" id="orgName" name="orgName"/>
                            </div>
                            <FormButtonAbstraction buttonText="Create" loadingText="Loading..."/>
                            <Toaster/>
                        </form>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
};