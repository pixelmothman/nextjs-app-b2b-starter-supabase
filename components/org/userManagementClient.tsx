"use client"

import InvitePopover from "@/components/org/invitePopover";
import SearchUserInOrg from "@/components/org/searchUserInOrg";
import UserManagementTable from "@/components/org/userManagementTable";
import { useEffect, useState } from "react";

export default function UserManagementClient({theUsersInTheOrg, orgID}: {theUsersInTheOrg: any, orgID: string}){
    const [usersInOrg, setUsersInOrg] = useState<any[]>([])
    const [userSearchState, setUserSearchState] = useState<string>('')
    
    useEffect(() => {
        if(theUsersInTheOrg !== undefined){
            setUsersInOrg(theUsersInTheOrg)
        }
    }, [theUsersInTheOrg]);

    useEffect(() => {
        if(userSearchState === ''){
            setUsersInOrg(theUsersInTheOrg);
        } else {
            console.log(userSearchState)
            console.log(theUsersInTheOrg.filter((user: any) => user.userEmail.includes(userSearchState)))
            setUsersInOrg(theUsersInTheOrg.filter((user: any) => user.userEmail.includes(userSearchState)))
        }
    }, [userSearchState]);

    const emailSearch = (search: string) => {
        setUserSearchState(search)
    };

    return (
        <div className="w-full h-full flex flex-col gap-3 p-[2px]">
            <div className="flex flex-row justify-between">
                <SearchUserInOrg
                userSearchState={userSearchState}
                emailSearch={emailSearch}
                />
                <InvitePopover orgID={orgID}/>
            </div>
            <UserManagementTable usersInOrg={usersInOrg} orgID={orgID}/>
        </div>
    )
}