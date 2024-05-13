import { createClient } from '@/utils/supabase/server'
import LoginOrSignUp from '../components/account/loginOrSignUp'
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const supabase = createClient();
  // if the user is already logged in, redirect to the dashboard
  const { data, error } = await supabase.auth.getUser()
  if (data?.user) {
      redirect('/dashboard');
  };
  
  return (
    <div className="w-full h-full flex flex-row">
      <div className="w-1/2 h-full bg-neutral-900">
      </div>
      <div className="w-full lg:w-1/2 h-full flex flex-col items-center justify-center p-4 bg-neutral-50 shadow-2xl shadow-black">
        <div className='w-[440px] h-fit p-4 flex flex-col justify-between gap-6 shadow-[0px_0px_10px_2px_rgba(0,0,0,0,3)] shadow-neutral-300 rounded-md'>
          <div className='w-full h-fit flex flex-col gap-2'>
            <h1 className="w-fit font-black text-xl text-neutral-900">
              nextjs-app-b2b-starter-supabase
            </h1>
            <p className="font-bold text-sm text-neutral-900">
            by <a target="_blank" href="https://twitter.com/pixelmothman" className='text-neutral-900 hover:text-blue-500 cursor-pointer'> @pixelmothman</a>
            </p>
          </div>
          <LoginOrSignUp/>
        </div>
      </div>
    </div>
    )
};