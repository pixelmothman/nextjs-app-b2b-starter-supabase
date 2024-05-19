import { useEffect, useState } from "react";
import EditUserOrgPopover from "./editUserOrgPopover"

export default function UserManagementTable({orgID, usersInOrg} : {orgID: string, usersInOrg: {
    userEmail: any;
    userRole: any;
    userStatus: any;
}[]}){
    const [usersInTable, setUsersInTable] = useState<any[]>([]);

    useEffect(() => {
        setUsersInTable(usersInOrg);
    }, [usersInOrg]);

    return (
        <div className="w-full h-full">
            <div className="w-full h-fit grid grid-cols-4 py-2 px-4 gap-2 bg-neutral-200 border border-neutral-300 rounded-t-md">
                <div className="w-full h-fit flex flex-row items-center justify-start">
                    <p className="text-sm font-semibold text-neutral-600">Email</p>
                </div>
                <div className="w-full h-fit flex flex-row items-center justify-start">
                    <p className="text-sm font-semibold text-neutral-600">Role</p>
                </div>
                <div className="w-full h-fit flex flex-row items-center justify-start">
                    <p className="text-sm font-semibold text-neutral-600">Status</p>
                </div>
                <div className="w-full h-fit flex flex-row items-center justify-end">
                    <p className="text-sm font-semibold text-neutral-600">Actions</p>
                </div>
            </div>
            {
                usersInTable.map((user: any, idx: number) => {
                    return (
                        <div key={user.userEmail} className="w-full h-fit grid grid-cols-4 py-4 px-4 gap-2 border border-neutral-300">
                            <div className="w-full h-fit flex flex-row items-center justify-start overflow-clip">
                                <p title={user.userEmail} className="text-sm font-semibold text-neutral-600">{user.userEmail}</p>
                            </div>
                            <div className="w-full h-fit flex flex-row items-center justify-start">
                                <p className="text-sm font-semibold text-neutral-600">{user.userRole.charAt(0).toUpperCase() + user.userRole.slice(1)}</p>
                            </div>
                            <div className="w-full h-fit flex flex-row items-center justify-start">
                                <p className="text-sm font-semibold text-neutral-600">{user.userStatus}</p>
                            </div>
                            <div className="w-full h-fit flex flex-row items-center justify-end">
                                <EditUserOrgPopover 
                                orgID={orgID}
                                userEmail={user.userEmail}
                                userRoleInOrg={user.userRole}
                                />
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
};