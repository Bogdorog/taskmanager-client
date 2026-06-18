import { useMutation, useQueryClient } from "@tanstack/react-query";
import {createColumn, deleteColumn, updateColumn, updateBoard, moveColumn} from "@/api/boardApi";
import { createTask, moveTask } from "@/api/taskApi";

export function useBoardMutations(companyId: number, boardId: number) {
    const queryClient = useQueryClient();
    const queryKey = ["boardPage", companyId, boardId];

    // Создание колонки
    const createColumnMutation = useMutation({
        mutationFn: (name: string) => createColumn({ boardId, name }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });

    // Обновление колонки (переименование)
    const updateColumnMutation = useMutation({
        mutationFn: ({ columnId, name }: { columnId: number; name: string }) =>
            updateColumn(boardId, columnId, { name }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });

    // Удаление колонки
    const deleteColumnMutation = useMutation({
        mutationFn: (columnId: number) => deleteColumn(boardId, columnId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });

    // Обновление параметров доски
    const updateBoardMutation = useMutation({
        mutationFn: ({ name, description }: { name: string; description: string }) =>
            updateBoard({ boardId, name, description }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });

    // Создание задачи
    const createTaskMutation = useMutation({
        mutationFn: createTask,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });

    // Перемещение колонки
    const moveColumnMutation = useMutation({
        mutationFn: (payload: { boardId: number; columnId: number; newIndex: number }) =>
            moveColumn(payload),
    });

    // Перемещение задачи
    const moveTaskMutation = useMutation({
        mutationFn: ({ taskId, payload }: { taskId: number; payload: { newColumnId: number } }) =>
            moveTask(taskId, payload),
    });

    return {
        createColumnMutation,
        updateColumnMutation,
        deleteColumnMutation,
        updateBoardMutation,
        createTaskMutation,
        moveColumnMutation,
        moveTaskMutation
    };
}