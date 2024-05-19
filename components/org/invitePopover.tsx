'use client'

import * as Popover from '@radix-ui/react-popover';
import { useEffect, useState } from 'react';
import { useFormState } from "react-dom";
import { inviteUserToOrg } from '@/utils/actions';
import FormButtonAbstraction from '../miscelaneous/formButtonAbstraction';
import toast, { Toaster } from 'react-hot-toast';

export default function InvitePopover({orgID}: {orgID: string}){
    const [state, formAction] = useFormState(inviteUserToOrg, '')
    const [emailOfInvitedUser, setEmailOfInvitedUser] = useState('');
    const [userRoleInOrgState, setUserRoleInOrgState] = useState('');

    useEffect(() => {
        if (state?.success === false) {
            toast.error(state.error.message + ' - ' + state.error.code)
        }
        if(state?.success === true){
            toast.success('User invited successfully!')
        }
    }, [state.success, state.error, state.successID]);

    return (
        <>
            <Popover.Root
            onOpenChange={(open) => {
                if(!open){
                    setEmailOfInvitedUser('')
                }
            }}>
                    <Popover.Trigger asChild>
                        <button
                        className='w-fit h-fit flex flex-row items-center py-2 px-2 gap-1 bg-neutral-100 text-xs font-semibold text-neutral-800 shadow-sm shadow-neutral-600 outline-0 rounded-sm focus:ring-2 focus:ring-neutral-800'
                        aria-label='Invite user to org'
                        >
                            Invite User
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 256 256"><path d="M216.49,104.49l-80,80a12,12,0,0,1-17,0l-80-80a12,12,0,0,1,17-17L128,159l71.51-71.52a12,12,0,0,1,17,17Z"></path></svg>
                        </button>
                    </Popover.Trigger>
                    <Popover.Portal>
                        <Popover.Content 
                        className='w-56 py-4 px-4 overflow-hiddren bg-neutral-50 shadow-sm shadow-neutral-400 rounded-sm'
                        side="bottom"
                        align="end"
                        sideOffset={5}
                        >
                            <div className='flex flex-col gap-2'>
                                <form action={formAction} className='flex flex-col gap-3'>
                                    <input type='hidden' value={orgID} name='orgID'/>
                                    <div className='flex flex-col gap-1'>
                                        <label htmlFor='emailOfInvitedUser' className='text-sm font-normal text-neutral-800'>User email</label>
                                        <input value={emailOfInvitedUser} onChange={
                                            (e) => setEmailOfInvitedUser(e.target.value)
                                        } required type='email' autoComplete='off' id='emailOfInvitedUser' name='emailOfInvitedUser' className='w-full h-8 px-2 border border-neutral-800 rounded-sm shadow-sm text-xs font-normal text-neutral-800 focus-visible:border-0 focus-visible:ring-2 focus-visible:ring-black' />
                                    </div>
                                    <Popover.Root>
                                        <Popover.Trigger asChild>
                                            <button
                                            className='relative w-full h-10 px-2 flex items-center justify-center border border-neutral-800 rounded-md shadow-sm text-sm font-normal text-neutral-800 hover:bg-neutral-800 hover:text-neutral-100 hover:fill-neutral-100 focus-visible:border-0 focus:outline-0 focus-visible:ring-2 focus-visible:ring-black'
                                            aria-label='Add user role in org'
                                            >
                                                {
                                                    userRoleInOrgState === '' ? 'Select role' : userRoleInOrgState.charAt(0).toUpperCase() + userRoleInOrgState.slice(1)
                                                }
                                                <svg className='absolute left-2' xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256"><path d="M168.49,199.51a12,12,0,0,1-17,17l-80-80a12,12,0,0,1,0-17l80-80a12,12,0,0,1,17,17L97,128Z"></path></svg>
                                            </button>
                                        </Popover.Trigger>
                                        <Popover.Portal>
                                            <Popover.Content 
                                            className='flex flex-col gap-2 w-fit h-fit p-4 bg-neutral-100 border border-neutral-800 rounded-l-md shadow-sm'
                                            side="left"
                                            align="start"
                                            sideOffset={17}
                                            >
                                                <div 
                                                aria-label='select-label-btn-1'
                                                className="relative flex flex-row gap-2 items-center justify-between text-xs font-semibold text-black select-none outline-none rounded-lg cursor-pointer"
                                                >
                                                    Owner
                                                    <button onClick={() => {
                                                        setUserRoleInOrgState('owner');
                                                    }} className={`flex items-center justify-center w-6 h-6 fill-neutral-700 border border-neutral-500 rounded-md focus:bg-neutral-800 focus:fill-white focus:outline-0 ${userRoleInOrgState === 'Owner' ? 'bg-neutral-600 fill-white' : ''}`}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256"><path d="M200,20H56A20,20,0,0,0,36,40V216a20,20,0,0,0,20,20H200a20,20,0,0,0,20-20V40A20,20,0,0,0,200,20Zm-4,192H60V44H196ZM84,68A12,12,0,0,1,96,56h64a12,12,0,0,1,0,24H96A12,12,0,0,1,84,68Zm8.8,127.37a48,48,0,0,1,70.4,0,12,12,0,0,0,17.6-16.32,72,72,0,0,0-19.21-14.68,44,44,0,1,0-67.19,0,72.12,72.12,0,0,0-19.2,14.68,12,12,0,0,0,17.6,16.32ZM128,116a20,20,0,1,1-20,20A20,20,0,0,1,128,116Z"></path></svg>
                                                    </button>
                                                </div>
                                                <div 
                                                aria-label='select-label-btn-2'
                                                className="relative flex flex-row gap-2 items-center justify-between text-xs font-semibold text-black select-none outline-none rounded-lg cursor-pointer"
                                                >
                                                    Member
                                                    <button onClick={() => {
                                                        setUserRoleInOrgState('member');
                                                    }} className={`flex items-center justify-center w-6 h-6 fill-neutral-700 border border-neutral-500 rounded-md focus:bg-neutral-800 focus:fill-white focus:outline-0 ${userRoleInOrgState === 'Member' ? 'bg-neutral-600 fill-white' : ''}`}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256"><path d="M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20ZM79.57,196.57a60,60,0,0,1,96.86,0,83.72,83.72,0,0,1-96.86,0ZM100,120a28,28,0,1,1,28,28A28,28,0,0,1,100,120ZM194,179.94a83.48,83.48,0,0,0-29-23.42,52,52,0,1,0-74,0,83.48,83.48,0,0,0-29,23.42,84,84,0,1,1,131.9,0Z"></path></svg>
                                                    </button>
                                                </div>
                                            </Popover.Content>
                                        </Popover.Portal>
                                    </Popover.Root>
                                    <input type='hidden' required name='userRoleInOrgState' value={userRoleInOrgState}/>
                                    <FormButtonAbstraction loadingText="Sending invite..." buttonText="Send invite" />
                                </form>
                            </div>
                        </Popover.Content>
                    </Popover.Portal>
                </Popover.Root>
            <Toaster/>
        </> 
    )
};