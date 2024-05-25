import NotificationsPopoverProvider from '../notifications/notificationsPopoverProvider';
import FirstOrgMenuDD from './firstOrgMenuDD';

export default async function CreateFirstOrgHeader(){

    return (
        <div className='w-full h-fit flex flex-row justify-between px-4 py-4 border-b border-neutral-300'>
            <div className="w-fit flex items-center justify-center">
                <span className="font-black text-base text-neutral-900">
                    nextjs-app-b2b-starter-supabase
                </span>
            </div>
            <div className='flex flex-row gap-2 items-center justify-center'>
                    <NotificationsPopoverProvider/>
                    <FirstOrgMenuDD/>
                </div>
        </div>
    )
}