export interface UserDto {
    id: number;
    login: string;
    fullName: string;
    phone: string;
    email: string;
    address: string;
    role: string;
    avatarUrl: string | null;
}

export interface UpdateProfileRequest {
    fullName: string;
    phone: string;
    email: string;
    address: string;
}

export interface ChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
}