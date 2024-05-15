"use client"

import Link from "next/link"

export default function GoBackFromAccount(){
    return (
        <Link href={'/dashboard'} className="absolute top-4 left-4 flex flex-row gap-2 items-center text-sm font-medium text-neutral-700 cursor-pointer">
            <svg className="fill-neutral-700" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256"><path d="M168.49,199.51a12,12,0,0,1-17,17l-80-80a12,12,0,0,1,0-17l80-80a12,12,0,0,1,17,17L97,128Z"></path></svg>
            <span>Go back</span>
        </Link>
    )
}