import api from "@/api/axios";

import type {
    LoginRequest,
    RegisterRequest,
    AuthResponse
} from "@/types/auth";

export const login = async (
    data: LoginRequest
): Promise<AuthResponse> => {

    const response = await api.post<AuthResponse>(
        "/auth/login",
        data
    );

    return response.data;
};

export const register = async (
    data: RegisterRequest
): Promise<void> => {

    await api.post(
        "/auth/register",
        data
    );
};

export async function requestPasswordReset(
    email: string,
): Promise<void> {

    await api.post(
        "/auth/password/reset/request",
        {
            email,
        },
    );
}

export async function confirmPasswordReset(
    token: string,
    newPassword: string,
): Promise<void> {

    await api.post(
        "/auth/password/reset/confirm",
        {
            token,
            newPassword,
        },
    );
}