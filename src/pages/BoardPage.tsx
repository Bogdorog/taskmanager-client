import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, CircularProgress, Typography, Button, Stack, Paper, Alert } from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { deleteBoard } from "@/api/boardApi";
import type { BoardDto } from "@/types/board";
import { getApiErrorMessage } from "@/utils/apiError";
import { useBoardData } from "@/hooks/useBoardData";
import { useBoardMutations } from "@/hooks/useBoardMutations";
import BoardColumn from "@/components/board/BoardColumn";
import CreateColumnDialog from "@/components/board/CreateColumnDialog.tsx";
import EditBoardDialog from "@/components/board/EditBoardDialog.tsx";
import CreateTaskDialog from "@/components/task/CreateTaskDialog.tsx";
import TaskDialog from "@/components/task/TaskDialog.tsx";
import BackButton from "@/components/utils/BackButton.tsx";
import EditColumnDialog from "@/components/board/EditColumnDialog.tsx";
import { useQueryClient } from "@tanstack/react-query";
import type {TaskPriority} from "@/types/task.ts";

function BoardPage() {
    const { id: companyIdStr, boardId: boardIdStr } = useParams<{ id: string; boardId: string }>();
    const companyId = Number(companyIdStr);
    const boardId = Number(boardIdStr);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data, isLoading, error: queryError } = useBoardData(companyId, boardId);
    const companyUsers = data?.companyUsers || [];
    const [board, setBoard] = useState<BoardDto | null>(null);

    // Подтягиваем свежие данные из React Query в наш локальный стейт, когда они приходят/обновляются
    useEffect(() => {
        if (data?.board) {
            setBoard(data.board);
        }
    }, [data?.board]);

    const mutations = useBoardMutations(companyId, boardId);

    const [error, setError] = useState("");
    const [editMode, setEditMode] = useState(false);

    // Состояния окон
    const [columnDialogOpen, setColumnDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editColumnOpen, setEditColumnOpen] = useState(false);
    const [createTaskOpen, setCreateTaskOpen] = useState(false);
    const [taskDialogOpen, setTaskDialogOpen] = useState(false);

    const [selectedColumnId, setSelectedColumnId] = useState<number | null>(null);
    const [selectedColumnName, setSelectedColumnName] = useState("");
    const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

    // Обработчики диалогов
    async function handleCreateColumn(name: string) {
        mutations.createColumnMutation.mutate(name, {
            onSuccess: () => setColumnDialogOpen(false),
            onError: (err) => setError(getApiErrorMessage(err))
        });
    }

    async function handleUpdateColumn(newName: string) {
        if (!selectedColumnId) return;
        mutations.updateColumnMutation.mutate(
            { columnId: selectedColumnId, name: newName },
            {
                onSuccess: () => {
                    setEditColumnOpen(false);
                    setSelectedColumnId(null);
                    setSelectedColumnName("");
                },
                onError: (err) => setError(getApiErrorMessage(err))
            }
        );
    }

    async function handleUpdateBoard(name: string, description: string) {
        mutations.updateBoardMutation.mutate(
            { name, description },
            {
                onSuccess: () => setEditDialogOpen(false),
                onError: (err) => setError(getApiErrorMessage(err))
            }
        );
    }

    async function handleDeleteBoard() {
        if (!board || !window.confirm("Вы уверены, что хотите безвозвратно удалить эту доску?")) return;
        try {
            await deleteBoard(board.id);
            queryClient.invalidateQueries({ queryKey: ["companyBoards", companyId] });
            navigate(-1);
        } catch (err: unknown) {
            setError(getApiErrorMessage(err));
        }
    }

    async function handleDeleteColumn(columnId: number) {
        if (!window.confirm("Удалить колонку вместе со всеми задачами внутри нее?")) return;
        mutations.deleteColumnMutation.mutate(columnId, {
            onError: (err) => setError(getApiErrorMessage(err))
        });
    }

    async function handleCreateTask(
        title: string,
        description: string,
        priority: TaskPriority,
        assignedUserId: number | null,
        dueDate: string | null
    ) {
        if (!selectedColumnId) return;
        mutations.createTaskMutation.mutate({
            companyId,
            columnId: selectedColumnId,
            title,
            description,
            priority,
            assignedUserId,
            dueDate,
        }, {
            onSuccess: () => setCreateTaskOpen(false),
            onError: (err) => setError(getApiErrorMessage(err))
        });
    }

    async function handleDragEnd(result: DropResult) {
        if (!board || !result.destination) return;

        const { source, destination, type } = result;

        // Перетаскивание КОЛОНОК
        if (type === "column" || source.droppableId === "board") {
            if (source.index === destination.index) return;

            const updatedColumns = [...board.columns];
            const [removed] = updatedColumns.splice(source.index, 1);
            updatedColumns.splice(destination.index, 0, removed);
            setBoard({ ...board, columns: updatedColumns });

            try {
                await mutations.moveColumnMutation.mutateAsync({
                    boardId: board.id,
                    columnId: removed.id,
                    newIndex: destination.index,
                });
            } catch (err: unknown) {
                setError(getApiErrorMessage(err));
                // В случае критической ошибки API обновляем кэш из React Query
                queryClient.invalidateQueries({ queryKey: ["boardPage", companyId, boardId] });
            }
            return;
        }

        // Перетаскивание ЗАДАЧ
        const sourceColumnId = Number(source.droppableId);
        const destinationColumnId = Number(destination.droppableId);

        if (sourceColumnId === destinationColumnId && source.index === destination.index) return;

        const sourceColIndex = board.columns.findIndex(c => c.id === sourceColumnId);
        const destColIndex = board.columns.findIndex(c => c.id === destinationColumnId);

        if (sourceColIndex === -1 || destColIndex === -1) return;

        const sourceColumn = board.columns[sourceColIndex];
        const destColumn = board.columns[destColIndex];

        const sourceTasks = [...sourceColumn.tasks];
        const destTasks = sourceColumnId === destinationColumnId ? sourceTasks : [...destColumn.tasks];

        const [movedTask] = sourceTasks.splice(source.index, 1);
        destTasks.splice(destination.index, 0, movedTask);

        const newColumns = [...board.columns];
        newColumns[sourceColIndex] = { ...sourceColumn, tasks: sourceTasks };
        newColumns[destColIndex] = { ...destColumn, tasks: destTasks };

        setBoard({ ...board, columns: newColumns });

        if (sourceColumnId !== destinationColumnId) {
            try {
                const taskId = Number(result.draggableId.replace(/^\D+/g, ""));

                await mutations.moveTaskMutation.mutateAsync({
                    taskId,
                    payload: { newColumnId: destinationColumnId },
                });
            } catch (err: unknown) {
                setError(getApiErrorMessage(err));
                // При ошибке откатываемся к валидным данным сервера
                queryClient.invalidateQueries({ queryKey: ["boardPage", companyId, boardId] });
            }
        }
    }

    // Первичная загрузка страницы проверяется по isLoading из React Query
    if (isLoading && !board) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (queryError || !board) {
        return (
            <Box sx={{ p: 4 }}>
                <Alert severity="warning">
                    {queryError ? getApiErrorMessage(queryError) : "Доска не найдена"}
                </Alert>
            </Box>
        );
    }

    return (
        <Paper square sx={{ display: "flex", flexDirection: "column", p: { xs: 2, md: 4 }, gap: 3, bgcolor: "#F4F7F5", minHeight: "100vh", boxShadow: "none" }}>

            {error && <Alert severity="error" onClose={() => setError("")} sx={{ borderRadius: 2 }}>{error}</Alert>}

            <Stack direction={{ xs: "column", md: "row" }} sx={{ justifyContent: "space-between", alignItems: { xs: "flex-start", md: "center" }, gap: 2 }}>
                <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                    <BackButton />
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: "text.primary" }}>
                            {board.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
                            {board.description || "Описание проекта отсутствует."}
                        </Typography>
                    </Box>
                </Stack>

                <Stack direction="row" spacing={1.5} sx={{ flexWrap: "wrap", gap: 1 }}>
                    <Button variant="outlined" size="small" onClick={() => setEditDialogOpen(true)} sx={{ textTransform: "none", borderRadius: 2 }}>
                        Параметры доски
                    </Button>
                    <Button variant="outlined" size="small" color="error" onClick={handleDeleteBoard} sx={{ textTransform: "none", borderRadius: 2 }}>
                        Удалить
                    </Button>
                    <Button
                        variant={editMode ? "contained" : "outlined"}
                        color={editMode ? "success" : "primary"}
                        size="small"
                        startIcon={<EditNoteIcon />}
                        onClick={() => setEditMode(!editMode)}
                        sx={{ textTransform: "none", borderRadius: 2 }}
                    >
                        {editMode ? "Готово" : "Управление структурой"}
                    </Button>
                    <Button variant="contained" size="small" startIcon={<AddBoxIcon />} onClick={() => setColumnDialogOpen(true)} sx={{ textTransform: "none", borderRadius: 2 }}>
                        Добавить колонку
                    </Button>
                </Stack>
            </Stack>

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="board" type="column" direction="horizontal">
                    {(provided) => (
                        <Box
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            sx={{
                                display: "flex",
                                gap: 3,
                                overflowX: "auto",
                                pb: 3,
                                pt: 1,
                                minHeight: "calc(100vh - 200px)",
                                alignItems: "flex-start"
                            }}
                        >
                            {board.columns.map((column, index) => (
                                <Draggable
                                    key={column.id}
                                    draggableId={`column-${column.id}`}
                                    index={index}
                                    isDragDisabled={!editMode}
                                >
                                    {(provided, snapshot) => (
                                        <Box
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            sx={{
                                                ...provided.draggableProps.style,
                                                opacity: snapshot.isDragging ? 0.8 : 1,
                                                transform: provided.draggableProps.style?.transform
                                            }}
                                        >
                                            <BoardColumn
                                                column={column}
                                                editMode={editMode}
                                                onDelete={handleDeleteColumn}
                                                onEditColumn={(colId, colName) => {
                                                    setSelectedColumnId(colId);
                                                    setSelectedColumnName(colName);
                                                    setEditColumnOpen(true);
                                                }}
                                                onCreateTask={(colId) => {
                                                    setSelectedColumnId(colId);
                                                    setCreateTaskOpen(true);
                                                }}
                                                onTaskClick={(taskId) => {
                                                    setSelectedTaskId(taskId);
                                                    setTaskDialogOpen(true);
                                                }}
                                            />
                                        </Box>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </Box>
                    )}
                </Droppable>
            </DragDropContext>

            <EditBoardDialog open={editDialogOpen} initialName={board.name} initialDescription={board.description} onClose={() => setEditDialogOpen(false)} onSubmit={handleUpdateBoard} />
            <CreateColumnDialog open={columnDialogOpen} onClose={() => setColumnDialogOpen(false)} onSubmit={handleCreateColumn} />
            <CreateTaskDialog
                open={createTaskOpen}
                onClose={() => setCreateTaskOpen(false)}
                onSubmit={handleCreateTask}
                users={companyUsers}
            />
            <EditColumnDialog
                open={editColumnOpen}
                initialName={selectedColumnName}
                onClose={() => {
                    setEditColumnOpen(false);
                    setSelectedColumnId(null);
                    setSelectedColumnName("");
                }}
                onSubmit={handleUpdateColumn}
            />
            <TaskDialog
                open={taskDialogOpen}
                taskId={selectedTaskId}
                onClose={() => {
                    setTaskDialogOpen(false);
                    setSelectedTaskId(null);
                }}
                onUpdated={async () => {
                    await queryClient.invalidateQueries({ queryKey: ["boardPage", companyId, boardId] });
                }}
            />
        </Paper>
    );
}

export default BoardPage;