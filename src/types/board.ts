export interface TaskShortDto {
    id: number;
    title: string;
    priority: string;
    status: string;

    assignedTo?: {
        id: number;
        login: string;
        fullName: string;
        role: string;
    };

    columnId: number;
}

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

export interface CreateBoardRequest {
    companyId: number;
    name: string;
    description: string;
}