import type {
    CompanyDto,
} from "@/types/company";

export interface CompanyContextType {

    companies: CompanyDto[];

    selectedCompany:
        CompanyDto | null;

    setSelectedCompany: (
        company: CompanyDto | null
    ) => void;

    refreshCompanies:
        () => Promise<void>;
}