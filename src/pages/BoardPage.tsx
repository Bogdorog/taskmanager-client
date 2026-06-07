import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, CircularProgress, Typography, Button, Stack, Paper, Alert } from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";

import {getBoard, createColumn, deleteBoard, updateBoard, deleteColumn, moveColumn, updateColumn} from "@/api/boardApi";
import { createTask, moveTask } from "@/api/taskApi";
import type { BoardDto } from "@/types/board";
import type { TaskPriority } from "@/types/task";
import { getApiErrorMessage } from "@/utils/apiError";

import BoardColumn from "@/components/board/BoardColumn";
import CreateColumnDialog from "@/components/board/CreateColumnDialog.tsx";
import EditBoardDialog from "@/components/board/EditBoardDialog.tsx";
import CreateTaskDialog from "@/components/task/CreateTaskDialog.tsx";
import TaskDialog from "@/components/task/TaskDialog.tsx";
import BackButton from "@/components/utils/BackButton.tsx";
import EditColumnDialog from "@/components/board/EditColumnDialog.tsx";
import type {CompanyMembershipDto} from "@/types/company.ts";
import {getCompanyMembers} from "@/api/companyApi.ts";

function BoardPage() {
    const { id: companyId, boardId } = useParams<{ id: string; boardId: string}>();
    const navigate = useNavigate();

    const [board, setBoard] = useState<BoardDto | null>(null);
    const [companyUsers, setCompanyUsers] = useState<CompanyMembershipDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Состояния диалоговых окон
    const [columnDialogOpen, setColumnDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editColumnOpen, setEditColumnOpen] = useState(false);
    const [createTaskOpen, setCreateTaskOpen] = useState(false);
    const [taskDialogOpen, setTaskDialogOpen] = useState(false);

    const [editMode, setEditMode] = useState(false);
    const [selectedColumnId, setSelectedColumnId] = useState<number | null>(null);
    const [selectedColumnName, setSelectedColumnName] = useState("");
    const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

    const fetchBoardData = async () => {
        if (!boardId) return;
        try {
            const [membersData, boardsData] = await Promise.all([
                getCompanyMembers(Number(companyId)),
                getBoard(Number(boardId))
            ]);
            setCompanyUsers(membersData);
            setBoard(boardsData);
        } catch (err: unknown) {
            setError(getApiErrorMessage(err));
        }
    };

    useEffect(() => {
        if (boardId) {
            setLoading(true);
            fetchBoardData().finally(() => setLoading(false));
        }
    }, [boardId]);

    async function handleCreateColumn(name: string) {
        if (!board) return;
        try {
            await createColumn({ boardId: board.id, name });
            await fetchBoardData();
        } catch (err: unknown) {
            setError(getApiErrorMessage(err));
        }
    }

    async function handleUpdateColumn(newName: string) {
        if (!board || !selectedColumnId) return;
        try {
            await updateColumn(board.id, selectedColumnId, { name: newName });
            await fetchBoardData();
        } catch (err: unknown) {
            setError(getApiErrorMessage(err));
        }
    }

    async function handleUpdateBoard(name: string, description: string) {
        if (!board) return;
        try {
            const updated = await updateBoard({ boardId: board.id, name, description });
            setBoard(updated);
            setEditDialogOpen(false);
        } catch (err: unknown) {
            setError(getApiErrorMessage(err));
        }
    }

    async function handleDeleteBoard() {
        if (!board || !window.confirm("Вы уверены, что хотите безвозвратно удалить эту доску?")) return;
        try {
            await deleteBoard(board.id);
            navigate(-1);
        } catch (err: unknown) {
            setError(getApiErrorMessage(err));
        }
    }

    async function handleDeleteColumn(columnId: number) {
        if (!board || !window.confirm("Удалить колонку вместе со всеми задачами внутри нее?")) return;
        try {
            await deleteColumn(board.id, columnId);
            await fetchBoardData();
        } catch (err: unknown) {
            setError(getApiErrorMessage(err));
        }
    }

    async function handleCreateTask(
        title: string,
        description: string,
        priority: TaskPriority,
        assignedUserId: number | null,
        dueDate: string | null
    ) {
        if (!board || !selectedColumnId) return;
        try {
            await createTask({
                companyId: Number(companyId),
                columnId: selectedColumnId,
                title,
                description,
                priority,
                assignedUserId,
                dueDate,
            });
            await fetchBoardData();
            setCreateTaskOpen(false);
        } catch (err: unknown) {
            setError(getApiErrorMessage(err));
        }
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
                await moveColumn({
                    boardId: board.id,
                    columnId: removed.id,
                    newIndex: destination.index,
                });
            } catch (err: unknown) {
                setError(getApiErrorMessage(err));
                void fetchBoardData();
            }
            return;
        }

        // Перетаскивание ЗАДАЧ
        const sourceColumnId = Number(source.droppableId);
        const destinationColumnId = Number(destination.droppableId);

        // Если задачу бросили в ту же ячейку, где она и была — ничего не делаем
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

        // Оптимистичное обновление UI
        setBoard({ ...board, columns: newColumns });

        // Шлем запрос на сервер только если сменилась колонка
        if (sourceColumnId !== destinationColumnId) {
            try {
                await moveTask(movedTask.id, {
                    newColumnId: destinationColumnId,
                });
            } catch (err: unknown) {
                setError(getApiErrorMessage(err));
                void fetchBoardData(); // Откат интерфейса к актуальной структуре бэка
            }
        }
    }

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!board) {
        return (
            <Box sx={{ p: 4 }}><Alert severity="warning">Доска не найдена</Alert></Box>
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
                users={companyUsers}/>
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
                onUpdated={fetchBoardData}
            />
        </Paper>
    );
}

export default BoardPage;