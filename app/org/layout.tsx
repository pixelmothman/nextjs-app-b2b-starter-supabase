import CreateFirstOrgHeader from "@/components/org/createFirstOrgHeader";
import { ReactNode } from "react";

export default async function OrgLayout( {children}: {children: ReactNode}) {
    //if user is not allowed to create an org redirect to dashboard
    return (
        <div className="w-full h-full flex-col bg-neutral-100 overflow-hidden">
            <CreateFirstOrgHeader/>
            {children}
        </div>
    )
}