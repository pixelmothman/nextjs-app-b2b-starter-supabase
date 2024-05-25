"use client"

import { acceptInvitationToOrg, rejectInvitationToOrg } from '@/utils/actions';
import * as Tooltip from '@radix-ui/react-tooltip';
import FormButtonShellAbstraction from "../miscelaneous/formButtonShellAbstraction";

export default function OrgInvitationNotification({orgInviteNotification}: {orgInviteNotification: {id: string, orgName: string, type: string, invitedBy: string}}){
    console.log(orgInviteNotification)
    return (
    <div key={orgInviteNotification.id} className="relative flex flex-row gap-2 items-center justify-between h-6 py-4 my-2 select-none outline-none rounded-lg">
        <div className='flex flex-row gap-2 items-center justify-center'>
        <span className='text-xs font-semibold text-black'>
        Invitation to join
        </span>
        <Tooltip.Provider
            delayDuration={50}
            >
                <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                        <div className='group flex items-center justify-center w-6 h-6 border border-neutral-500 rounded-md hover:bg-neutral-800'>
                            <svg className='fill-neutral-700 group-hover:fill-neutral-50' xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 256 256"><path d="M239.73,208H224V96a16,16,0,0,0-16-16H164a4,4,0,0,0-4,4V208H144V32.41a16.43,16.43,0,0,0-6.16-13,16,16,0,0,0-18.72-.69L39.12,72A16,16,0,0,0,32,85.34V208H16.27A8.18,8.18,0,0,0,8,215.47,8,8,0,0,0,16,224H240a8,8,0,0,0,8-8.53A8.18,8.18,0,0,0,239.73,208ZM76,184a8,8,0,0,1-8.53,8A8.18,8.18,0,0,1,60,183.72V168.27A8.19,8.19,0,0,1,67.47,160,8,8,0,0,1,76,168Zm0-56a8,8,0,0,1-8.53,8A8.19,8.19,0,0,1,60,127.72V112.27A8.19,8.19,0,0,1,67.47,104,8,8,0,0,1,76,112Zm40,56a8,8,0,0,1-8.53,8,8.18,8.18,0,0,1-7.47-8.26V168.27a8.19,8.19,0,0,1,7.47-8.26,8,8,0,0,1,8.53,8Zm0-56a8,8,0,0,1-8.53,8,8.19,8.19,0,0,1-7.47-8.26V112.27a8.19,8.19,0,0,1,7.47-8.26,8,8,0,0,1,8.53,8Z"></path></svg>
                        </div>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                        <Tooltip.Content
                        className="p-2 bg-neutral-700 text-xs text-white rounded-md shadow-lg"
                        side='top'
                        sideOffset={5}
                        >
                            {orgInviteNotification.orgName}
                            <Tooltip.Arrow className='fill-neutral-800'/>
                        </Tooltip.Content>
                    </Tooltip.Portal>
                </Tooltip.Root>
            </Tooltip.Provider>
        </div>
        <div className='flex flex-row gap-2'>
            <Tooltip.Provider
            delayDuration={50}
            >
                <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                        <div className='group flex items-center justify-center w-6 h-6 border border-neutral-500 rounded-md hover:bg-neutral-800'>
                            <svg className='fill-neutral-700 group-hover:fill-neutral-50' xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 256 256"><path d="M230.93,220a8,8,0,0,1-6.93,4H32a8,8,0,0,1-6.92-12c15.23-26.33,38.7-45.21,66.09-54.16a72,72,0,1,1,73.66,0c27.39,8.95,50.86,27.83,66.09,54.16A8,8,0,0,1,230.93,220Z"></path></svg>
                        </div>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                        <Tooltip.Content
                        className="p-2 bg-neutral-700 text-xs text-white rounded-md shadow-lg"
                        side='top'
                        sideOffset={5}
                        >
                            {orgInviteNotification.invitedBy}
                            <Tooltip.Arrow className='fill-neutral-800'/>
                        </Tooltip.Content>
                    </Tooltip.Portal>
                </Tooltip.Root>
            </Tooltip.Provider>
            <Tooltip.Provider
            delayDuration={50}
            >
                <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                        <form action={rejectInvitationToOrg} className='group flex items-center justify-center w-6 h-6 bg-red-500 border border-neutral-500 rounded-md hover:bg-red-800 cursor-pointer'>
                            <input type='hidden' name='orgID' value={orgInviteNotification.id}/>
                            <FormButtonShellAbstraction>
                                <svg className='fill-neutral-700 group-hover:fill-red-200' xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 256 256"><path d="M208.49,191.51a12,12,0,0,1-17,17L128,145,64.49,208.49a12,12,0,0,1-17-17L111,128,47.51,64.49a12,12,0,0,1,17-17L128,111l63.51-63.52a12,12,0,0,1,17,17L145,128Z"></path></svg>
                            </FormButtonShellAbstraction>
                        </form>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                        <Tooltip.Content
                        className="p-2 bg-neutral-700 text-xs text-white rounded-md shadow-lg"
                        side='top'
                        sideOffset={5}
                        >
                            Reject Invitation
                            <Tooltip.Arrow className='fill-neutral-800'/>
                        </Tooltip.Content>
                    </Tooltip.Portal>
                </Tooltip.Root>
            </Tooltip.Provider>
            <Tooltip.Provider
            delayDuration={50}
            >
                <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                        <form action={acceptInvitationToOrg} className='group flex items-center justify-center w-6 h-6 bg-green-500 border border-neutral-500 rounded-md hover:bg-green-800'>
                            <input type='hidden' name='orgID' value={orgInviteNotification.id}/>
                            <FormButtonShellAbstraction>
                                <svg className='fill-neutral-700 group-hover:fill-green-200' xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 256 256"><path d="M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z"></path></svg>
                            </FormButtonShellAbstraction>
                        </form>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                        <Tooltip.Content
                        className="p-2 bg-neutral-700 text-xs text-white rounded-md shadow-lg"
                        side='top'
                        sideOffset={5}
                        >
                            Accept Invitation
                            <Tooltip.Arrow className='fill-neutral-800'/>
                        </Tooltip.Content>
                    </Tooltip.Portal>
                </Tooltip.Root>
            </Tooltip.Provider>
        </div>
    </div>  
    ) 
}