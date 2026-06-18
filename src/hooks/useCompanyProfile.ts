import { useQuery } from "@tanstack/react-query";
import { getCompany, getCompanyMembers, getCompanyRoles, getMyPermissions } from "@/api/companyApi";

export function useCompanyProfile(companyId: number) {
    const isIdValid = !isNaN(companyId) && companyId > 0;

    // Запрос базовой информации (Компания и Права)
    const baseQuery = useQuery({
        queryKey: ["companyBaseProfile", companyId],
        queryFn: async () => {
            const [company, permissions] = await Promise.all([
                getCompany(companyId),
                getMyPermissions(companyId),
            ]);
            return { company, permissions };
        },
        enabled: isIdValid,
        staleTime: 2 * 60 * 1000,
    });

    const canManage = baseQuery.data?.permissions?.canManageCompany ?? false;

    // Запрос участники и роли (только для админов)
    const managementQuery = useQuery({
        queryKey: ["companyManagementData", companyId],
        queryFn: async () => {
            const [members, roles] = await Promise.all([
                getCompanyMembers(companyId),
                getCompanyRoles(companyId),
            ]);
            return { members, roles };
        },
        enabled: isIdValid && baseQuery.isSuccess && canManage,
        staleTime: 5 * 60 * 1000,
    });

    return {
        company: baseQuery.data?.company,
        permissions: baseQuery.data?.permissions,
        members: managementQuery.data?.members || [],
        roles: managementQuery.data?.roles || [],
        isLoading: baseQuery.isLoading || (canManage && managementQuery.isLoading),
        error: baseQuery.error || managementQuery.error,
    };
}