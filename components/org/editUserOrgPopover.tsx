'use client'

import * as Popover from '@radix-ui/react-popover';
import { useEffect, useState } from 'react';
import { useFormState } from "react-dom";
import { removeUserFromOrg, editUserRoleInOrg } from '@/utils/actions'
import FormButtonAbstraction from '../miscelaneous/formButtonAbstraction';
import toast, { Toaster } from 'react-hot-toast';
import FormButtonShellAbstraction from '../miscelaneous/formButtonShellAbstraction';

export default function EditUserOrgPopover({orgID, userEmail, userRoleInOrg}: {orgID: string, userEmail: string, userRoleInOrg: string}){
    const [state, formAction] = useFormState(editUserRoleInOrg, '')
    const [stateOne, formActionOne] = useFormState(removeUserFromOrg, '');
    const [userRoleInOrgState, setUserRoleInOrgState] = useState(userRoleInOrg);

    useEffect(() => {
        if (state?.success === false) {
            toast.error(state.error.message + ' - ' + state.error.code)
        };
        if(state?.success === true){
            
            toast.success('User updated successfully!');
        };
    }, [state.success, state.error, state.successID]);

    useEffect(() => {
        if (stateOne?.success === false) {
            toast.error(stateOne.error.message + ' - ' + stateOne.error.code)
        };
        if(stateOne?.success === true){
            toast.success('User removed successfully!');
        };
    }, [stateOne.success, stateOne.error, stateOne.successID]);

    return (
        <>
            <Popover.Root>
                <Popover.Trigger asChild>
                    <button
                    className='w-fit h-fit py-1 px-1 bg-neutral-100 shadow-sm shadow-neutral-600 outline-0 rounded-sm focus:ring-2 focus:ring-neutral-800'
                    aria-label='Edit shopping list item'
                    >
                        <svg className='fill-neutral-800' xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256"><path d="M144,128a16,16,0,1,1-16-16A16,16,0,0,1,144,128ZM60,112a16,16,0,1,0,16,16A16,16,0,0,0,60,112Zm136,0a16,16,0,1,0,16,16A16,16,0,0,0,196,112Z"></path></svg>
                    </button>
                </Popover.Trigger>
                <Popover.Portal>
                    <Popover.Content 
                    className='w-56 py-4 px-4 overflow-hidden bg-neutral-50 shadow-md shadow-neutral-400 rounded-r-lg rounded-bl-lg'
                    side="right"
                    align="start"
                    sideOffset={17}
                    >
                        <div className='relative flex flex-col gap-2'>
                            <form action={formAction} className='flex flex-col gap-3'>
                                <input type='hidden' name='orgID' value={orgID}/>
                                <input type='hidden' name='emailFromUserToUpdate' value={userEmail}/>
                                <input type='hidden' name='newRole' value={userRoleInOrgState}/>
                                <Popover.Root>
                                    <Popover.Trigger asChild>
                                        <button
                                        className='relative w-full h-10 px-2 flex items-center justify-center border border-neutral-800 rounded-md shadow-sm text-sm font-normal text-neutral-800 hover:bg-neutral-800 hover:text-neutral-100 hover:fill-neutral-100 focus-visible:border-0 focus:outline-0 focus-visible:ring-2 focus-visible:ring-black'
                                        aria-label='Add event'
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
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 256 256"><path d="M221.56,100.85,141.61,25.38l-.16-.15a19.93,19.93,0,0,0-26.91,0l-.17.15L34.44,100.85A20.07,20.07,0,0,0,28,115.55V208a20,20,0,0,0,20,20H208a20,20,0,0,0,20-20V115.55A20.07,20.07,0,0,0,221.56,100.85ZM204,204H52V117.28l76-71.75,76,71.75Z"></path></svg>
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
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 256 256"><path d="M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20ZM79.57,196.57a60,60,0,0,1,96.86,0,83.72,83.72,0,0,1-96.86,0ZM100,120a28,28,0,1,1,28,28A28,28,0,0,1,100,120ZM194,179.94a83.48,83.48,0,0,0-29-23.42,52,52,0,1,0-74,0,83.48,83.48,0,0,0-29,23.42,84,84,0,1,1,131.9,0Z"></path></svg>
                                                </button>
                                            </div>
                                        </Popover.Content>
                                    </Popover.Portal>
                                </Popover.Root>
                                <FormButtonAbstraction loadingText="Updating role..." buttonText="Change role" />
                            </form>
                            <form action={formActionOne} className='absolute bottom-0 left-0'>
                                <input type="hidden" name="orgID" value={orgID}/>
                                <input type="hidden" name="emailFromUserToRemove" value={userEmail}/>
                                <FormButtonShellAbstraction>
                                    <div className='flex items-center justify-center w-[34px] h-[34px] fill-neutral-700 border border-neutral-500 rounded-md hover:bg-red-500 group-data-[highlighted]:bg-red-800 group-data-[highlighted]:fill-white group-data-[highlighted]:border-black'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256"><path d="M216,48H180V36A28,28,0,0,0,152,8H104A28,28,0,0,0,76,36V48H40a12,12,0,0,0,0,24h4V208a20,20,0,0,0,20,20H192a20,20,0,0,0,20-20V72h4a12,12,0,0,0,0-24ZM100,36a4,4,0,0,1,4-4h48a4,4,0,0,1,4,4V48H100Zm88,168H68V72H188ZM116,104v64a12,12,0,0,1-24,0V104a12,12,0,0,1,24,0Zm48,0v64a12,12,0,0,1-24,0V104a12,12,0,0,1,24,0Z"></path></svg>
                                    </div>
                                </FormButtonShellAbstraction>
                            </form>
                        </div>
                    </Popover.Content>
                </Popover.Portal>
            </Popover.Root>
            <Toaster/>
        </>
    )
};