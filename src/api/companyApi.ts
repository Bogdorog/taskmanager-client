import api from "@/api/axios";

import type {
    CompanyDto,
    CreateCompanyRequest,
    CompanyMembershipDto, CompanyRoleDto,
} from "@/types/company";

export const getMyCompanies =
    async (): Promise<CompanyDto[]> => {

        const response =
            await api.get<CompanyDto[]>(
                "/companies/my"
            );

        return response.data;
    };

export const createCompany =
    async (
        data: CreateCompanyRequest
    ): Promise<CompanyDto> => {

        const response =
            await api.post<CompanyDto>(
                "/companies",
                data
            );

        return response.data;
    };

export const getCompany =
    async (
        companyId: number
    ): Promise<CompanyDto> => {

        const response =
            await api.get<CompanyDto>(
                `/companies/${companyId}`
            );

        return response.data;
    };

export const getCompanyMembers =
    async (
        companyId: number
    ): Promise<CompanyMembershipDto[]> => {

        const response =
            await api.get<
                CompanyMembershipDto[]
            >(
                `/companies/${companyId}/members`
            );

        return response.data;
    };

export const getCompanyRoles =
    async (
        companyId: number
    ): Promise<CompanyRoleDto[]> => {

        const response =
            await api.get<
                CompanyRoleDto[]
            >(
                `/companies/${companyId}/roles`
            );

        return response.data;
    };

export const inviteUser =
    async (
        companyId: number,
        data: {
            userId: number;
            roleId: number;
        }
    ): Promise<void> => {

        await api.post(
            `/companies/${companyId}/members`,
            data
        );
    };