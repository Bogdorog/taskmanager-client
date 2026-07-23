import api from "@/api/axios";

export interface NotificationEventDto {
    id: number;
    type: string;
    payload: any;
    createdAt: string;
    read: boolean;
}

export interface UpdateRetentionRequest {
    days: number;
}

/**
 * Получение списка уведомлений (всех или только непрочитанных)
 * @param unreadOnly флаг фильтрации уведомлений (true = непрочитанные)
 */
export async function getNotifications(unreadOnly = false): Promise<NotificationEventDto[]> {
    const response = await api.get<NotificationEventDto[]>("/notifications", {
        params: { unreadOnly }
    });
    return response.data;
}

/**
 * Отметка уведомления как прочитанного
 * @param id id уведомления
 */
export async function markNotificationAsRead(id: number): Promise<void> {
    await api.post(`/notifications/${id}/read`);
}

/**
 * Обновление срока хранения уведомлений
 * @param days срок хранения в днях
 */
export async function updateNotificationRetention(days: number): Promise<void> {
    await api.put("/notifications/settings/retention", { days });
}