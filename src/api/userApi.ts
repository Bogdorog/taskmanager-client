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

export const uploadAvatar =
    async (
        file: File
    ): Promise<UserDto> => {

        const formData = new FormData();

        formData.append("file", file);

        const response =
            await api.put<UserDto>(
                "/user/me/avatar",
                formData,
                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data",
                    },
                }
            );

        return response.data;
    };

export const deleteAvatar =
    async (): Promise<UserDto> => {

        const response =
            await api.delete<UserDto>(
                "/user/me/avatar"
            );

        return response.data;
    };

export const changePassword =
    async (
        data: ChangePasswordRequest
    ): Promise<void> => {

        await api.put(
            "/user/me/password",
            data
        );
    };