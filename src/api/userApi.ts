import api from "@/api/axios";

import type {
    UserDto,
    UpdateProfileRequest,
    ChangePasswordRequest,
} from "@/types/user";

export const getCurrentUser =
    async (): Promise<UserDto> => {

        const response =
            await api.get<UserDto>(
                "/user/me"
            );

        return response.data;
    };

export const updateProfile =
    async (
        data: UpdateProfileRequest
    ): Promise<UserDto> => {

        const response =
            await api.put<UserDto>(
                "/user/me",
                data
            );

        return response.data;
    };

/**
 * Загрузить/изменить аватар текущего пользователя
 */
export async function uploadUserAvatar(file: File): Promise<UserDto> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.put<UserDto>("/user/me/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
}

/**
 * Удалить аватар текущего пользователя
 */
export async function deleteUserAvatar(): Promise<UserDto> {
    const response = await api.delete<UserDto>("/user/me/avatar");
    return response.data;
}

/**
 * Смена пароля в профиле
 */
export async function changePassword(payload: ChangePasswordRequest): Promise<void> {
    await api.post("/user/me/change-password", payload);
}

/**
 * Запрос на отправку письма для удаления
 */
export async function requestAccountDeletion(): Promise<void> {
    await api.delete("/user/me");
}

/**
 * Подтверждение удаления аккаунта по токену
 */
export async function confirmAccountDeletion(token: string): Promise<void> {
    await api.post(`/auth/account-delete/${token}`);
}