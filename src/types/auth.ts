export interface LoginRequest {
    login: string;
    password: string;
}

export interface RegisterRequest {
    login: string;
    fullName: string;
    phone: string;
    email: string;
    address: string;
    password: string;
}

export interface UserShortDto {
    id: number;
    login: string;
    fullName: string;
    role: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: UserShortDto;
}