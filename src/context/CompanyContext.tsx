import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import type {
    ReactNode,
} from "react";

import type {
    CompanyDto,
} from "@/types/company";

import {
    getMyCompanies,
} from "@/api/companyApi";

import {
    CompanyContext,
} from "@/context/company-context";

interface Props {
    children: ReactNode;
}

function CompanyProvider({
                             children,
                         }: Props) {

    const [
        companies,
        setCompanies,
    ] = useState<CompanyDto[]>([]);

    const [
        selectedCompany,
        setSelectedCompany,
    ] = useState<CompanyDto | null>(
        null
    );

    const refreshCompanies =
        useCallback(
            async () => {

                const data =
                    await getMyCompanies();

                setCompanies(data);

                setSelectedCompany(
                    previous => {

                        if (
                            previous
                        ) {
                            return previous;
                        }

                        return data[0] ?? null;
                    }
                );
            },
            []
        );

    useEffect(() => {

        let active = true;

        async function load() {

            if (!active) {
                return;
            }

            await refreshCompanies();
        }

        void load();

        return () => {
            active = false;
        };

    }, [refreshCompanies]);

    const value = useMemo(
        () => ({
            companies,
            selectedCompany,
            setSelectedCompany,
            refreshCompanies,
        }),
        [
            companies,
            selectedCompany,
            refreshCompanies,
        ]
    );

    return (
        <CompanyContext.Provider
            value={value}
        >
            {children}
        </CompanyContext.Provider>
    );
}

export default CompanyProvider;