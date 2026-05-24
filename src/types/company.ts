export interface CompanyDto {
    id: number;
    name: string;
    description: string;
    email: string;
    phone: string;
    address: string;
}

export interface CreateCompanyRequest {
    name: string;
    description: string;
    email: string;
    phone: string;
    address: string;
}

export interface CompanyRoleDto {
    id: number;
    name: string;
    description: string;
    permissions: string[];
}

export interface CompanyMembershipDto {
    id: number;

    user: {
        id: number;
        login: string;
        fullName: string;
        role: string;
    };

    role: CompanyRoleDto;

    joinedAt: string;
}