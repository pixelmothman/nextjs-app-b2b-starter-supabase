'use client'
import * as Popover from '@radix-ui/react-popover';
import Link from 'next/link';
import CreateOrgDialog from './createOrgDialog';
import { usePathname } from 'next/navigation';

export default function OrgsPopover({orgs}: {orgs: any}){
    const path = usePathname().split('/');
    return (
        <Popover.Root>
            <Popover.Trigger className="relative outline-0 rounded-sm focus:ring-2 focus:ring-neutral-800">
                <svg className='fill-neutral-700' xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 256 256"><path d="M184.49,167.51a12,12,0,0,1,0,17l-48,48a12,12,0,0,1-17,0l-48-48a12,12,0,0,1,17-17L128,207l39.51-39.52A12,12,0,0,1,184.49,167.51Zm-96-79L128,49l39.51,39.52a12,12,0,0,0,17-17l-48-48a12,12,0,0,0-17,0l-48,48a12,12,0,0,0,17,17Z"></path></svg>
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Content
                className="w-48 max-h-72 pt-4 pb-4 px-4 flex flex-col bg-neutral-50 shadow-sm shadow-neutral-400 rounded-sm overflow-hidden overflow-y-auto"
                sideOffset={10}
                align="start"
                side='bottom'
                >
                    <span className='text-xs font-semibold text-neutral-700 mb-2'>
                        Organizations
                    </span>
                    {
                        orgs && orgs.map((org: any) => {
                            return (
                                <div key={org.org_id}  className='flex flex-col gap-2'>
                                {
                                    path[2] === org.org_id ? (
                                        <div className="group relative flex flex-row gap-2 items-center justify-between h-6 py-4 my-2 select-none outline-none rounded-lg cursor-pointer">
                                            <p className="text-xs font-semibold text-neutral-900">{org.org_name.org_name}</p>
                                            <div className='flex items-center justify-center w-6 h-6 bg-neutral-700 border border-neutral-500 rounded-md group-hover:bg-neutral-900 outline-0 group-focus:bg-neutral-900'>
                                                <svg className='fill-neutral-100'  xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 256 256"><path d="M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z"></path></svg>
                                            </div>
                                        </div>
                                    ) : (
                                        <Link href={`/dashboard/${org.org_id}`} className="group relative flex flex-row gap-2 items-center justify-between h-6 py-4 my-2 select-none outline-none rounded-lg cursor-pointer">
                                            <p className="text-xs font-semibold text-neutral-900">{org.org_name.org_name}</p>
                                            <div className='flex items-center justify-center w-6 h-6 border border-neutral-500 rounded-md group-hover:bg-neutral-900 outline-0 group-focus:bg-neutral-900'>
                                                <svg className='fill-neutral-800 group-hover:fill-neutral-100 group-focus:fill-neutral-100' xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="#000000" viewBox="0 0 256 256"><path d="M184.49,136.49l-80,80a12,12,0,0,1-17-17L159,128,87.51,56.49a12,12,0,1,1,17-17l80,80A12,12,0,0,1,184.49,136.49Z"></path></svg>
                                            </div>
                                        </Link>
                                    )
                                }
                                </div>
                            )
                        })
                    }
                    <div className='h-[1px] my-4 bg-neutral-700 opacity-10' />
                    <CreateOrgDialog/>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    )
};