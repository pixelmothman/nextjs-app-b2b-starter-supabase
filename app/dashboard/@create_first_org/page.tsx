import DashboardHeader from "@/components/dashboard/dashboardHeader";
import FormCreateOrg from "@/components/org/formCreateOrg";

export default function CreateOrgPage(){
    return (
        <div className="w-full h-full flex justify-center mt-64">
            <div className="w-96 h-fit">
                <FormCreateOrg/>
            </div>
        </div>
    )
};