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