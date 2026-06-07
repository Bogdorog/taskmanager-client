import type {UserShortDto} from "@/types/auth.ts";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type TaskStatus = "BACKLOG" | "IN_PROGRESS" | "ON_REVIEW" |"DONE" | "CANCELLED";

export interface CreateTaskRequest {
    companyId: number;
    columnId: number;
    title: string;
    description: string;
    priority: string;
    assignedUserId: number | null;
    dueDate: string | null;
}

export interface TaskDto {
    id: number;
    title: string;
    description: string;
    status: string;
    priority: string;
    assignedTo: UserShortDto;
    createdBy: UserShortDto;
    companyId: number;
    columnId: number;
    dueDate: string;
    createdAt: string;
    updatedAt: string;
}

export interface TaskCommentDto {
    id: number;
    taskId: number;
    user: UserShortDto;
    commentText: string;
    createdAt: string;
}

export interface UpdateTaskRequest {
    assignedToId: number | null,
    title: string;
    description: string;
    priority: TaskPriority;
    status: TaskStatus;
    dueDate: string | null;
}

export interface MoveTaskRequest {
    newColumnId: number;
}

export interface AddCommentRequest {
    text: string;
}