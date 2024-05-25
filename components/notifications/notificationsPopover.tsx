"use client"

import * as Popover from '@radix-ui/react-popover';
import OrgInvitationNotification from '@/components/notifications/orgInvitationNotification';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

export default function NotificationsPopover({orgInvitationNotifications}: {orgInvitationNotifications: any}){
    const searchParams = useSearchParams();
    const successFromParams = searchParams.get('success');
    const successMessageFromParams = searchParams.get('message');
    const successIdFromParams = searchParams.get('id');
    const errorMessageFromParams = searchParams.get('error');
    const errorCodeFromParams = searchParams.get('code');

    useEffect(() => {   
        if (successFromParams === 'false') {
            toast.error(errorMessageFromParams + ' - ' + errorCodeFromParams);
        };
        if(successFromParams === 'true'){
            toast.success(successMessageFromParams);
        };
        console.log(1)
    }, [successFromParams, errorMessageFromParams, errorCodeFromParams, successIdFromParams])

    return (
    <>
        <Popover.Root>
            <Popover.Trigger className="relative bg-neutral-50 shadow-sm shadow-neutral-400 outline-0 rounded-sm focus:ring-2 focus:ring-neutral-800">
                {
                    orgInvitationNotifications && orgInvitationNotifications.length > 0 ? (
                        <div className='absolute z-20 top-[7px] right-[6px] w-2 h-2 bg-green-500 border border-neutral-800 rounded-full'/>
                    ) : null
                }
                <div className="flex w-8 h-8 items-center justify-center bg-neutral-100 text-neutral-800 rounded-full">
                    <svg className='fill-neutral-800' xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000000" viewBox="0 0 256 256"><path d="M224,44H32A12,12,0,0,0,20,56V192a20,20,0,0,0,20,20H216a20,20,0,0,0,20-20V56A12,12,0,0,0,224,44ZM193.15,68,128,127.72,62.85,68ZM44,188V83.28l75.89,69.57a12,12,0,0,0,16.22,0L212,83.28V188Z"></path></svg>
                </div>
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Content
                className="w-72 max-h-52 pt-4 pb-4 px-4 bg-neutral-50 shadow-sm shadow-neutral-400 rounded-sm overflow-hidden overflow-y-auto"
                sideOffset={5}
                align="end"
                >
                    <span className='flex justify-end text-xs font-semibold text-neutral-700 mb-2'>
                        Notifications
                    </span>
                    {
                        ('error' in orgInvitationNotifications) ? (
                            <p className="flex flex-row gap-2 items-center h-6 py-4 text-xs font-semibold text-neutral-800 select-none outline-none rounded-md">
                                Error fetching notifications
                            </p>
                        ) : orgInvitationNotifications && orgInvitationNotifications.length > 0 ? (orgInvitationNotifications.map((notification: any, index: number) => {
                            return (
                                <div key={notification.id}>
                                    <OrgInvitationNotification orgInviteNotification={notification}/>
                                    {
                                        index === orgInvitationNotifications.length - 1 ? null : (
                                            <div className='h-[1px] my-4 bg-neutral-700 opacity-10' />
                                        )
                                    }
                                </div>
                            )
                        })) : (
                            <div>
                                <p  className="flex flex-row gap-2 items-center h-6 py-4 text-xs font-semibold text-neutral-800 select-none outline-none rounded-md">
                                    No notifications
                                </p>
                                <div className='h-[1px] mb-2 bg-neutral-700 opacity-10' />
                            </div>
                        )
                    }
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    </>
    )
}