import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CompanyDto } from "@/types/company";
import { getMyCompanies } from "@/api/companyApi";
import { CompanyContext } from "@/context/company-context";
import {useAuth} from "@/hooks/useAuth.ts";

interface Props {
    children: ReactNode;
}

function CompanyProvider({ children }: Props) {
    const { user } = useAuth(); // Или isAuthenticated, смотря что возвращает твой AuthContext
    const [companies, setCompanies] = useState<CompanyDto[]>([]);
    const [selectedCompany, setSelectedCompany] = useState<CompanyDto | null>(null);

    const refreshCompanies = useCallback(async () => {
        // Проверяем авторизацию через контекст, а не через localStorage напрямую
        if (!user) {
            setCompanies([]);
            setSelectedCompany(null);
            return;
        }

        try {
            const data = await getMyCompanies();
            setCompanies(data);
            setSelectedCompany((prev) => prev ?? data[0] ?? null);
        } catch (error) {
            console.error("Failed to fetch companies:", error);
        }
    }, [user]);

    // Триггерим загрузку только тогда, когда меняется статус авторизации пользователя
    useEffect(() => {
        void refreshCompanies();
    }, [refreshCompanies]);

    const value = useMemo(
        () => ({
            companies,
            selectedCompany,
            setSelectedCompany,
            refreshCompanies,
        }),
        [companies, selectedCompany, refreshCompanies]
    );

    return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
}

export default CompanyProvider;