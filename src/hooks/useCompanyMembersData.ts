import { useQuery } from "@tanstack/react-query";
import { getCompanyMembers, getCompanyRoles, getMyPermissions } from "@/api/companyApi";

export function useCompanyMembersData(companyId: number) {
    const isIdValid = !isNaN(companyId) && companyId > 0;

    const permissionsQuery = useQuery({
        queryKey: ["companyPermissions", companyId],
        queryFn: () => getMyPermissions(companyId),
        enabled: isIdValid,
        staleTime: 1 * 60 * 1000, // 1 минута
    });

    const canView = permissionsQuery.data?.canViewMembers ?? false;

    // Загружаем сотрудников и роли, только если можно смотреть
    const membersAndRolesQuery = useQuery({
        queryKey: ["companyMembersAndRoles", companyId],
        queryFn: async () => {
            const [members, roles] = await Promise.all([
                getCompanyMembers(companyId),
                getCompanyRoles(companyId),
            ]);
            return { members, roles };
        },
        enabled: isIdValid && permissionsQuery.isSuccess && canView,
        staleTime: 30 * 1000, // Данные сотрудников обновляются чаще
    });

    return {
        permissions: permissionsQuery.data,
        members: membersAndRolesQuery.data?.members || [],
        roles: membersAndRolesQuery.data?.roles || [],
        isLoading: permissionsQuery.isLoading || (canView && membersAndRolesQuery.isLoading),
        error: permissionsQuery.error || membersAndRolesQuery.error,
        refetchAll: async () => {
            await permissionsQuery.refetch();
            if (canView) {
                await membersAndRolesQuery.refetch();
            }
        }
    };
}