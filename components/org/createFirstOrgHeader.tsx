'use client'

import { createClient } from '@/utils/supabase/client';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useRouter } from 'next/navigation';


export default function CreateFirstOrgHeader(){
    const supabase = createClient()
    const router = useRouter()

    return (
        <div className='w-full h-fit flex flex-row justify-between px-4 py-4 border-b border-neutral-300'>
            <div className="w-fit flex items-center justify-center">
                <span className="font-black text-base text-neutral-900">
                    nextjs-app-b2b-starter-supabase
                </span>
            </div>
            <DropdownMenu.Root>
                <DropdownMenu.Trigger className="bg-neutral-50 shadow-sm shadow-neutral-400 outline-0 rounded-sm focus:ring-2 focus:ring-neutral-800">
                    <div className="flex w-8 h-8 items-center justify-center bg-neutral-100 text-neutral-800 fill-neutral-800 rounded-full cursor-default">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256"><path d="M128,76a52,52,0,1,0,52,52A52.06,52.06,0,0,0,128,76Zm0,80a28,28,0,1,1,28-28A28,28,0,0,1,128,156Zm92-27.21v-1.58l14-17.51a12,12,0,0,0,2.23-10.59A111.75,111.75,0,0,0,225,71.89,12,12,0,0,0,215.89,66L193.61,63.5l-1.11-1.11L190,40.1A12,12,0,0,0,184.11,31a111.67,111.67,0,0,0-27.23-11.27A12,12,0,0,0,146.3,22L128.79,36h-1.58L109.7,22a12,12,0,0,0-10.59-2.23A111.75,111.75,0,0,0,71.89,31.05,12,12,0,0,0,66,40.11L63.5,62.39,62.39,63.5,40.1,66A12,12,0,0,0,31,71.89,111.67,111.67,0,0,0,19.77,99.12,12,12,0,0,0,22,109.7l14,17.51v1.58L22,146.3a12,12,0,0,0-2.23,10.59,111.75,111.75,0,0,0,11.29,27.22A12,12,0,0,0,40.11,190l22.28,2.48,1.11,1.11L66,215.9A12,12,0,0,0,71.89,225a111.67,111.67,0,0,0,27.23,11.27A12,12,0,0,0,109.7,234l17.51-14h1.58l17.51,14a12,12,0,0,0,10.59,2.23A111.75,111.75,0,0,0,184.11,225a12,12,0,0,0,5.91-9.06l2.48-22.28,1.11-1.11L215.9,190a12,12,0,0,0,9.06-5.91,111.67,111.67,0,0,0,11.27-27.23A12,12,0,0,0,234,146.3Zm-24.12-4.89a70.1,70.1,0,0,1,0,8.2,12,12,0,0,0,2.61,8.22l12.84,16.05A86.47,86.47,0,0,1,207,166.86l-20.43,2.27a12,12,0,0,0-7.65,4,69,69,0,0,1-5.8,5.8,12,12,0,0,0-4,7.65L166.86,207a86.47,86.47,0,0,1-10.49,4.35l-16.05-12.85a12,12,0,0,0-7.5-2.62c-.24,0-.48,0-.72,0a70.1,70.1,0,0,1-8.2,0,12.06,12.06,0,0,0-8.22,2.6L99.63,211.33A86.47,86.47,0,0,1,89.14,207l-2.27-20.43a12,12,0,0,0-4-7.65,69,69,0,0,1-5.8-5.8,12,12,0,0,0-7.65-4L49,166.86a86.47,86.47,0,0,1-4.35-10.49l12.84-16.05a12,12,0,0,0,2.61-8.22,70.1,70.1,0,0,1,0-8.2,12,12,0,0,0-2.61-8.22L44.67,99.63A86.47,86.47,0,0,1,49,89.14l20.43-2.27a12,12,0,0,0,7.65-4,69,69,0,0,1,5.8-5.8,12,12,0,0,0,4-7.65L89.14,49a86.47,86.47,0,0,1,10.49-4.35l16.05,12.85a12.06,12.06,0,0,0,8.22,2.6,70.1,70.1,0,0,1,8.2,0,12,12,0,0,0,8.22-2.6l16.05-12.85A86.47,86.47,0,0,1,166.86,49l2.27,20.43a12,12,0,0,0,4,7.65,69,69,0,0,1,5.8,5.8,12,12,0,0,0,7.65,4L207,89.14a86.47,86.47,0,0,1,4.35,10.49l-12.84,16.05A12,12,0,0,0,195.88,123.9Z"></path></svg>
                    </div>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                    <DropdownMenu.Content
                    className="w-56 py-4 px-4 overflow-hiddren bg-neutral-50 shadow-sm shadow-neutral-400 rounded-sm"
                    sideOffset={5}
                    align="end"
                    >
                        <DropdownMenu.Label className='flex justify-end text-xs font-semibold text-neutral-700 mb-2'>
                            Settings
                        </DropdownMenu.Label>
                        <DropdownMenu.Item onClick={() => router.push('/dashboard/account')} className="group relative flex flex-row gap-2 items-center justify-between h-6 py-4 my-2 text-xs font-semibold text-black select-none outline-none rounded-lg cursor-pointer data-[disabled]:text-white data-[disabled]:pointer-events-none">
                            Delete Account
                            <div className='flex items-center justify-center w-6 h-6 fill-neutral-700 border border-neutral-500 rounded-md group-data-[highlighted]:bg-neutral-800 group-data-[highlighted]:fill-white group-data-[highlighted]:border-black'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 256 256"><path d="M216,48H180V36A28,28,0,0,0,152,8H104A28,28,0,0,0,76,36V48H40a12,12,0,0,0,0,24h4V208a20,20,0,0,0,20,20H192a20,20,0,0,0,20-20V72h4a12,12,0,0,0,0-24ZM100,36a4,4,0,0,1,4-4h48a4,4,0,0,1,4,4V48H100Zm88,168H68V72H188ZM116,104v64a12,12,0,0,1-24,0V104a12,12,0,0,1,24,0Zm48,0v64a12,12,0,0,1-24,0V104a12,12,0,0,1,24,0Z"></path></svg>
                            </div>
                        </DropdownMenu.Item>
                        
                        <DropdownMenu.Separator className='h-[1px] my-4 bg-neutral-700 opacity-10' />
                        <DropdownMenu.Item onClick={() => {
                            supabase.auth.signOut()
                            router.push('/')
                            }} className="group relative flex flex-row gap-2 items-center justify-center h-6 bg-white text-xs font-semibold text-black border border-neutral-800 select-none outline-none rounded-md cursor-pointer data-[disabled]:text-white data-[disabled]:pointer-events-none data-[highlighted]:bg-neutral-800 data-[highlighted]:text-white">
                            Log Out
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>
        </div>
    )
}