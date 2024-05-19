import OrgSettingsMenu from "@/components/org/orgSettingsMenu";
import { ReactNode } from "react";

export default function OrgSettingsLayout({children}: {children: ReactNode}) {
    return (
        <div className="w-full h-full p-4">
            <div className="w-full h-full p-6 bg-neutral-50 shadow-[0px_0px_4px_2px_rgba(0,0,0,0,3)] shadow-neutral-300 rounded-sm overflow-hidden">
                <div className="flex flex-col gap-4 overflow-y-auto">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl font-bold text-neutral-900">Organization</h1>
                        <div className="flex flex-col">
                            <OrgSettingsMenu/>
                            <div className="w-full h-[2px] mx-[2px] -mt-[2px] bg-neutral-300 rounded-lg"/>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    )
};