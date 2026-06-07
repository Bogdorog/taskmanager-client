import api from "@/api/axios";

import type {
    CompanyDto,
    CreateCompanyRequest,
    CompanyMembershipDto, CompanyRoleDto,
} from "@/types/company";
import type {
    CompanyPermissions
} from "@/types/company-permissions";

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

export async function getMyPermissions(
    companyId: number
): Promise<CompanyPermissions> {

    const response =
        await api.get(
            `/companies/${companyId}/permissions/me`
        );

    return response.data;
}

export interface RoleRequest {
    companyId: number;
    name: string;
    description: string;
    permissions: string[];
}

export interface AssignRoleRequest {
    companyId: number;
    membershipId: number;
    roleId: number;
}

export interface TransferOwnershipRequest {
    companyId: number;
    newOwnerUserId: number;
    newOwnerRoleId: number;
}

export async function createRole(
    companyId: number,
    request: RoleRequest
): Promise<void> {

    await api.post(
        `/companies/${companyId}/roles`,
        request
    );
}

export async function assignRole(
    companyId: number,
    membershipId: number,
    roleId: number
): Promise<void> {

    await api.put(
        `/companies/${companyId}/members/${membershipId}/role`,
        {
            roleId,
        }
    );
}

export async function transferOwnership(
    companyId: number,
    request: TransferOwnershipRequest
): Promise<void> {

    await api.put(
        `/companies/${companyId}/transfer-owner/${request.newOwnerUserId}`,
        request
    );
}

export async function updateCompany(companyId: number, data: CreateCompanyRequest): Promise<CompanyDto> {
    const response = await api.put<CompanyDto>(`/companies/${companyId}`, data);
    return response.data;
}

export async function deleteCompany(companyId: number): Promise<void> {
    await api.delete(`/companies/${companyId}`, { data: { companyId } });
}

export async function leaveCompany(
    companyId: number
): Promise<void> {

    await api.delete(
        `/companies/${companyId}/leave`
    );
}