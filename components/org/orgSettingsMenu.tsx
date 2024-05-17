"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function OrgSettingsMenu(){
    const path = usePathname().split('/');
    const settingsPages: string[]  = ["General", "User Management"];
    
    return (
        <div className="w-fit h-fit grid grid-cols-2 grid-rows-1 gap-2">
            {
                settingsPages.map((page: string) => {
                    return (
                        <Link href={`/dashboard/${path[2]}/settings/${page.split(' ').join('').toLowerCase()}`} className={`w-full h-fit flex flex-row items-center justify-center px-2 py-1 ${
                            path[4] === page.split(' ').join('').toLowerCase() ? 'bg-neutral-200' : 'bg-neutral-50'
                        } hover:bg-neutral-200 text-xs font-semibold text-neutral-600 border-2 border-neutral-300 rounded-md cursor-pointer`}>
                        {page}
                        </Link>
                    )
                })
            }
        </div>
    )
};