import api from "@/api/axios";

import type {
    CreateTaskRequest,
    UpdateTaskRequest,
    TaskDto, TaskCommentDto, MoveTaskRequest, AddCommentRequest,
} from "@/types/task";

const BASE_URL = "/tasks";

/**
 * Создание новой задачи
 */
export async function createTask(request: CreateTaskRequest): Promise<TaskDto> {
    const response = await api.post<TaskDto>(BASE_URL, request);
    return response.data;
}

/**
 * Получение полной информации о задаче по её ID
 */
export async function getTask(taskId: number): Promise<TaskDto> {
    const response = await api.get<TaskDto>(`${BASE_URL}/${taskId}`);
    return response.data;
}

/**
 * Полное обновление текстовых полей, приоритета и дедлайна задачи
 */
export async function updateTask(taskId: number, request: UpdateTaskRequest): Promise<TaskDto> {
    const response = await api.put<TaskDto>(`${BASE_URL}/${taskId}`, request);
    return response.data;
}

/**
 * Удаление задачи с доски
 */
export async function deleteTask(taskId: number): Promise<void> {
    await api.delete(`${BASE_URL}/${taskId}`);
}

/**
 * Перемещение задачи между колонками (смена её колонки-родителя)
 */
export async function moveTask(taskId: number, request: MoveTaskRequest): Promise<void> {
    await api.patch(`${BASE_URL}/${taskId}/move`, request);
}

// =========================================================
// ГЛОБАЛЬНЫЕ ФИЛЬТРЫ / ВЫБОРКИ ЗАДАЧ КОМПАНИИ
// =========================================================

/**
 * Получить все задачи компании
 */
export async function getCompanyTasks(companyId: number): Promise<TaskDto[]> {
    const response = await api.get<TaskDto[]>(`${BASE_URL}/company/${companyId}`);
    return response.data;
}

/**
 * Получить задачи компании, где текущий пользователь является исполнителем
 */
export async function getMyTasks(companyId: number): Promise<TaskDto[]> {
    const response = await api.get<TaskDto[]>(`${BASE_URL}/company/${companyId}/my`);
    return response.data;
}

/**
 * Получить задачи компании, которые текущий пользователь лично создал
 */
export async function getCreatedTasks(companyId: number): Promise<TaskDto[]> {
    const response = await api.get<TaskDto[]>(`${BASE_URL}/company/${companyId}/created`);
    return response.data;
}

/**
 * Получить список всех комментариев к задаче
 */
export async function getComments(taskId: number): Promise<TaskCommentDto[]> {
    const response = await api.get<TaskCommentDto[]>(`${BASE_URL}/${taskId}/comments`);
    return response.data;
}

/**
 * Добавить новый комментарий к задаче
 */
export async function addComment(taskId: number, request: AddCommentRequest): Promise<TaskCommentDto> {
    const response = await api.post<TaskCommentDto>(`${BASE_URL}/${taskId}/comments`, request);
    return response.data;
}

/**
 * Удалить комментарий по его ID
 */
export async function deleteComment(taskId: number, commentId: number): Promise<void> {
    await api.delete(`${BASE_URL}/${taskId}/comments/${commentId}`);
}