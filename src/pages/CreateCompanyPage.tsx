import {
    createCompany
} from "@/api/companyApi.ts";

import CompanyForm
    from "@/components/company/CompanyForm.tsx";

import {
    useNavigate
} from "react-router-dom";

import {useCompany} from "@/hooks/useCompany";
import type {CreateCompanyRequest} from "@/types/company.ts";

function CreateCompanyPage() {

    const navigate =
        useNavigate();

    const {
        refreshCompanies
    } = useCompany();

    const handleSubmit =
        async (data: CreateCompanyRequest) => {

            const company =
                await createCompany(
                    data
                );

            await refreshCompanies();

            navigate(
                `/companies/${company.id}`
            );
        };

    return (
        <CompanyForm
            onSubmit={handleSubmit}
        />
    );
}

export default CreateCompanyPage;