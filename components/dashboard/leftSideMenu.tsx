"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function LeftSideMenu({orgID}: {orgID: string}){
    const path = usePathname().split('/');
    return (
        <div className="w-full h-full flex flex-col gap-2 justify-between">
            <div className="flex flex-col gap-2">
                <Link href={`
                /dashboard/${orgID}
                `} className={`group relative h-fit flex flex-row p-2 gap-2 items-center ${path.length === 3 ? 'bg-neutral-100 shadow-[0px_0px_4px_2px_rgba(0,0,0,0,3)] shadow-neutral-300 focus:shadow-neutral-400' : 'bg-neutral-200 group-hover:bg-neutral-800 shadow-[inset_0px_0px_3px_1px_rgba(0,0,0,0,3)] shadow-neutral-400 hover:shadow-[inset_0px_0px_3px_1px_rgba(0,0,0,0,3)] hover:shadow-neutral-600 focus:shadow-neutral-900'} rounded-md outline-none`}>
                    <div className={`flex items-center justify-center w-6 h-6 ${path.length === 3 ? ' bg-neutral-100 shadow-[inset_0px_0px_2px_1px_rgba(0,0,0,0,3)] shadow-neutral-400' : ' bg-neutral-200 shadow-[inset_0px_0px_3px_1px_rgba(0,0,0,0,3)] shadow-neutral-400'} rounded-md`}>
                        <svg className={`${path.length === 3 ? 'fill-neutral-600' : 'fill-neutral-400'}`} xmlns="http://www.w3.org/2000/svg" width="12" height="12"  viewBox="0 0 256 256"><path d="M224,120v96a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V120a15.87,15.87,0,0,1,4.69-11.32l80-80a16,16,0,0,1,22.62,0l80,80A15.87,15.87,0,0,1,224,120Z"></path></svg>
                    </div>
                    <span className={`text-xs font-semibold ${path.length === 3 ? 'text-neutral-800' : 'text-neutral-600'}`}>
                        Home
                    </span>
                </Link>
            </div>
            <div className="flex flex-col gap-2">
                <Link href={`
                /dashboard/${orgID}/settings/general
                `} className={`group relative h-fit flex flex-row p-2 gap-2 items-center ${path[3] === 'settings' ? 'bg-neutral-100 shadow-[0px_0px_4px_2px_rgba(0,0,0,0,3)] shadow-neutral-300 focus:shadow-neutral-400' : 'bg-neutral-200 group-hover:bg-neutral-800 shadow-[inset_0px_0px_3px_1px_rgba(0,0,0,0,3)] shadow-neutral-400 hover:shadow-[inset_0px_0px_3px_1px_rgba(0,0,0,0,3)] hover:shadow-neutral-600 focus:shadow-neutral-900'} rounded-md outline-none`}>
                    <div className={`flex items-center justify-center w-6 h-6 ${path[3] === 'settings' ? ' bg-neutral-100 shadow-[inset_0px_0px_2px_1px_rgba(0,0,0,0,3)] shadow-neutral-400' : ' bg-neutral-200 shadow-[inset_0px_0px_3px_1px_rgba(0,0,0,0,3)] shadow-neutral-400'} rounded-md`}>
                        <svg className={`${path[3] === 'settings' ? 'fill-neutral-600' : 'fill-neutral-400'}`} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 256 256"><path d="M240,204H228V96a20,20,0,0,0-20-20H172V32a20,20,0,0,0-28.45-18.12l-104,48.54A20.06,20.06,0,0,0,28,80.55V204H16a12,12,0,0,0,0,24H240a12,12,0,0,0,0-24ZM204,100V204H172V100ZM52,83.09,148,38.3V204H52ZM132,112v12a12,12,0,0,1-24,0V112a12,12,0,0,1,24,0Zm-40,0v12a12,12,0,0,1-24,0V112a12,12,0,0,1,24,0Zm0,52v12a12,12,0,0,1-24,0V164a12,12,0,0,1,24,0Zm40,0v12a12,12,0,0,1-24,0V164a12,12,0,0,1,24,0Z"></path></svg>
                    </div>
                    <span className={`text-xs font-semibold ${path[3] === 'settings' ? 'text-neutral-800' : 'text-neutral-600'}`}>
                    Organization Settings
                    </span>
                </Link>
            </div>
        </div>
    )
}