import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNotifications, markNotificationAsRead } from "@/api/notificationApi";
import type { NotificationEventDto } from "@/api/notificationApi";

export function useNotifications(unreadOnly = false) {
    const queryClient = useQueryClient();
    const queryKey = ["notifications", unreadOnly];

    const { data: notifications = [], isLoading, error } = useQuery({
        queryKey,
        queryFn: () => getNotifications(unreadOnly),
        staleTime: Infinity,
    });

    // Мутация прочтения
    const readMutation = useMutation({
        mutationFn: markNotificationAsRead,
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey });
            const previousNotifications = queryClient.getQueryData<NotificationEventDto[]>(queryKey);

            if (previousNotifications) {
                queryClient.setQueryData<NotificationEventDto[]>(
                    queryKey,
                    previousNotifications.map(n => n.id === id ? { ...n, read: true } : n)
                );
            }
            return { previousNotifications };
        },
        onError: (_err, _id, context) => {
            if (context?.previousNotifications) {
                queryClient.setQueryData(queryKey, context.previousNotifications);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey });
        }
    });

    return {
        notifications,
        isLoading,
        error,
        markAsRead: readMutation.mutate
    };
}