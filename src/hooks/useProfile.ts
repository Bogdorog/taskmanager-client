import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    deleteUserAvatar, getCurrentUser, updateProfile, uploadUserAvatar
} from "@/api/userApi";
import {useNavigate} from "react-router-dom";

const QUERY_KEY = ["currentUser"];

export function useProfile() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const query = useQuery({
        queryKey: QUERY_KEY,
        queryFn: getCurrentUser,
    });
    // Мутация обновления текстовых полей профиля
    const updateProfileMutation = useMutation({
        mutationFn: updateProfile,
        onSuccess: (updatedUser) => {
            queryClient.setQueryData(QUERY_KEY, updatedUser);
        },
    });
    // Мутация загрузки нового аватара
    const uploadAvatarMutation = useMutation({
        mutationFn: uploadUserAvatar,
        onSuccess: (updatedUser) => {
            queryClient.setQueryData(QUERY_KEY, updatedUser);
        },
    });
    // Мутация удаления аватара
    const deleteAvatarMutation = useMutation({
        mutationFn: deleteUserAvatar,
        onSuccess: (updatedUser) => {
            // Перезаписываем пользователя в кэше моделью, где avatarUrl = null
            queryClient.setQueryData(QUERY_KEY, updatedUser);
        },
    });
    // Функция для полного выхода из системы
    const logout = async () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        queryClient.clear();
        window.dispatchEvent(new Event("storage"));
        navigate("/login");
    };

    return {
        user: query.data,
        isLoading: query.isLoading,
        error: query.error,
        isUpdating: updateProfileMutation.isPending,
        isUploading: uploadAvatarMutation.isPending || deleteAvatarMutation.isPending,
        updateProfile: updateProfileMutation.mutateAsync,
        uploadAvatar: uploadAvatarMutation.mutateAsync,
        removeAvatar: deleteAvatarMutation.mutateAsync,
        logout,
    };
}