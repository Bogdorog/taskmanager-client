import api from "@/api/axios";

import type {
    BoardDto,
    CreateBoardRequest, CreateColumnRequest, MoveColumnRequest, MoveTaskRequest, UpdateBoardRequest,
    UpdateColumnRequest,
} from "@/types/board";

export const getBoards =
    async (
        companyId: number
    ): Promise<BoardDto[]> => {

        const response =
            await api.get<BoardDto[]>(
                `/tasks/boards/company/${companyId}`
            );

        return response.data;
    };

export const getBoard =
    async (
        boardId: number
    ): Promise<BoardDto> => {

        const response =
            await api.get<BoardDto>(
                `/tasks/boards/${boardId}`
            );

        return response.data;
    };

export async function createBoard(
    request: CreateBoardRequest,
): Promise<BoardDto> {

    const response =
        await api.post(
            "/tasks/boards",
            request,
        );

    return response.data;
}

export async function updateBoard(
    request: UpdateBoardRequest,
): Promise<BoardDto> {

    const response =
        await api.put(
            `/tasks/boards/${request.boardId}`,
            request,
        );

    return response.data;
}

export async function deleteBoard(
    boardId: number,
): Promise<void> {

    await api.delete(
        `/tasks/boards/${boardId}`,
    );
}

export async function createColumn(
    request: CreateColumnRequest,
): Promise<void> {

    try {

        await api.post(
            `/tasks/boards/${request.boardId}/columns`,
            request,
        );

    } catch (error: any) {

        console.log(
            error.response?.data,
        );

        throw error;
    }
}

/**
 * Переименование колонки на доске
 */
export async function updateColumn(boardId: number, columnId: number, request: UpdateColumnRequest): Promise<void> {
    await api.put(`/tasks/boards/${boardId}/columns/${columnId}`, request);
}

export async function moveColumn(
    request: MoveColumnRequest,
): Promise<void> {

    await api.patch(
        `/tasks/boards/${request.boardId}/columns/${request.columnId}/move`,
        request,
    );
}

export async function deleteColumn(
    boardId: number,
    columnId: number,
): Promise<void> {

    await api.delete(
        `/tasks/boards/${boardId}/columns/${columnId}`,
    );
}

export async function moveTask(
    request: MoveTaskRequest,
): Promise<void> {

    await api.patch(
        `/tasks/${request.taskId}/move`,
        request,
    );
}