import api from "@/api/axios";

export interface MediaAssetDto {
    id: string; // UUID на фронте представляем как string
    uploadedBy: number;
    fileName: string;
    downloadUrl: string;
}

export interface AttachmentDto {
    id: number; // Идентификатор вложения задачи (Long)
    media: MediaAssetDto; // Объект самого медиа-файла
}

const BASE_URL = "/attachments";

/**
 * Загрузить файл в задачу
 */
export async function uploadTaskAttachment(taskId: number, file: File): Promise<AttachmentDto> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<AttachmentDto>(`${BASE_URL}/tasks/${taskId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
}

/**
 * Получить все вложения задачи
 */
export async function getTaskAttachments(taskId: number): Promise<AttachmentDto[]> {
    const response = await api.get<AttachmentDto[]>(`${BASE_URL}/tasks/${taskId}`);
    return response.data;
}

/**
 * Удалить вложение задачи (принимает ID из MediaAssetDto.id, но на бэке он мапится как Long/UUID в зависимости от логики БД, передаем как string/number)
 */
export async function deleteTaskAttachment(attachmentId: string | number): Promise<void> {
    await api.delete(`${BASE_URL}/tasks/${attachmentId}`);
}

/**
 * Загрузить вложение в комментарий
 */
export async function uploadCommentAttachment(commentId: number, file: File): Promise<AttachmentDto> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(`${BASE_URL}/comments/${commentId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
}

/**
 * Получить вложения конкретного комментария (если они не приходят сразу внутри объекта TaskCommentDto)
 */
export async function getCommentAttachments(commentId: number): Promise<AttachmentDto[]> {
    const response = await api.get(`${BASE_URL}/comments/${commentId}`);
    return response.data;
}

/**
 * Удалить вложение из комментария (принимает id комментария и UUID медиа-файла)
 */
export async function deleteCommentAttachment(commentId: number, mediaAssetId: string): Promise<void> {
    await api.delete(`${BASE_URL}/comments/${commentId}/${mediaAssetId}`);
}

/**
 * Скачивает защищенный файл с бэкенда с передачей токенов и возвращает локальную URL-ссылку на Blob
 */
export async function downloadProtectedFile(downloadUrl: string): Promise<string> {
    const response = await api.get(downloadUrl.slice(4), {
        responseType: "blob", // Переключаем Axios в режим работы с бинарными данными
    });

    // Создаем внутреннюю безопасную ссылку в памяти браузера (blob:http://localhost...)
    return URL.createObjectURL(response.data);
}