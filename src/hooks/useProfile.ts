import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    deleteUserAvatar, getCurrentUser, updateProfile, uploadUserAvatar
} from "@/api/userApi";
import {useNavigate} from "react-router-dom";

const QUERY_KEY = ["currentUser"];

export function useProfile() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    // Получение текущего пользователя
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
            // Прямо обновляем данные пользователя в кэше React Query
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
        // Полностью очищаем КЭШ React Query
        queryClient.clear();

        // Удаляем токены авторизации из хранилища (замени ключи на свои)
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/login");
    };

    return {
        user: query.data,
        isLoading: query.isLoading,
        error: query.error,
        // Флаги загрузки для UI (синхронизируем с процессами мутаций)
        isUpdating: updateProfileMutation.isPending,
        // Аватар считается в процессе загрузки, если выполняется либо добавление, либо удаление
        isUploading: uploadAvatarMutation.isPending || deleteAvatarMutation.isPending,
        // Методы для вызова в компонентах (используем mutateAsync, чтобы прокидывать ошибки в try/catch формы)
        updateProfile: updateProfileMutation.mutateAsync,
        uploadAvatar: uploadAvatarMutation.mutateAsync,
        removeAvatar: deleteAvatarMutation.mutateAsync,
        logout,
    };
}