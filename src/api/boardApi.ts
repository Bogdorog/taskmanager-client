import api from "@/api/axios";

import type {
    BoardDto,
    CreateBoardRequest,
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

export const createBoard =
    async (
        data: CreateBoardRequest
    ): Promise<BoardDto> => {

        const response =
            await api.post<BoardDto>(
                "/tasks/boards",
                data
            );

        return response.data;
    };