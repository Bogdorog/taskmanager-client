import type {UserShortDto} from "@/types/auth.ts";

export interface BoardColumnDto {
    id: number;
    name: string;
    position: number;
    tasks: TaskShortDto[];
}

export interface BoardDto {
    id: number;
    name: string;
    description: string;
    columns: BoardColumnDto[];
}

export interface TaskShortDto {
    id: number;
    title: string;
    priority: string;
    status: string;
    assignedTo: UserShortDto | null;
    columnId: number;
}

export interface CreateBoardRequest {
    companyId: number;
    name: string;
    description: string;
}

export interface UpdateBoardRequest {
    boardId: number;
    name: string;
    description: string;
}

export interface CreateColumnRequest {
    boardId: number;
    name: string;
}

export interface UpdateColumnRequest {
    name: string;
}

export interface MoveColumnRequest {
    boardId: number;
    columnId: number;
    newIndex: number;
}

export interface MoveTaskRequest {
    taskId: number;
    targetColumnId: number;
    newPosition: number;
}