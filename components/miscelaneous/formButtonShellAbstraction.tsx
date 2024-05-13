'use client'

import { ReactNode } from 'react';
import { useFormStatus } from 'react-dom'

export default function FormButtonShellAbstraction( {children}: {children: ReactNode}){
    const { pending } = useFormStatus();

    return (
        <button type="submit" className="relative w-full h-full flex items-center justify-center">
            {
                pending ? <span className='aboslute inset-0 text-xs font-bold text-neutral-800'>...</span> : children
            }
        </button>
    )
};