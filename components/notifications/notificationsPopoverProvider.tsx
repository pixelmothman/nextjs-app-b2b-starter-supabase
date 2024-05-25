"use server"

import { getAllNotifications } from '@/utils/data';
import NotificationsPopover from '@/components/notifications/notificationsPopover';

export default async function NotificationsPopoverProvider(){
    //get notifications
    const notifications = await getAllNotifications();
    return (
        <NotificationsPopover 
        orgInvitationNotifications={(notifications as any).orgInvitationNotifications}
        />
    )
}