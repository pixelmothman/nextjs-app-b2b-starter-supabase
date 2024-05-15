"use client"

import { useState } from "react";
import FormLogin from "./formLogin";
import FormSignUp from "./formSignUp";
import { useSearchParams } from 'next/navigation'

export default function LoginOrSignUp(){
    const [isLogin, setIsLogin] = useState(true);

    const searchParams = useSearchParams();

    const signupEmailConfirmed = searchParams.get('email_confirmed');
    const userConfirmedInvitation = searchParams.get('user_confirmed_invitation');

    return (
        <>
            {
                signupEmailConfirmed === 'true' ? (
                    <div className='w-full flex flex-col gap-2'>
                        <p className="font-medium text-xs text-neutral-800">
                            You have successfully confirmed your email. You can now log in.
                        </p>
                        <FormLogin setIsLogin={setIsLogin}/>
                    </div>
                ) : userConfirmedInvitation === 'true' ? (
                    <div className='w-full flex flex-col gap-2'>
                        <p className="font-medium text-xs text-neutral-800">
                            You have successfully confirmed the invitation. You can now log in.
                        </p>
                        <FormLogin setIsLogin={setIsLogin}/>
                    </div>
                ) : isLogin ? <FormLogin setIsLogin={setIsLogin}/> : <FormSignUp setIsLogin={setIsLogin}/>
            }
        </>
    )
};