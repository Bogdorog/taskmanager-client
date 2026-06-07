import { Box, Button, IconButton, Paper, Typography, Stack } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { Droppable, Draggable } from "@hello-pangea/dnd";

import type { BoardColumnDto } from "@/types/board.ts";
import TaskCard from "./TaskCard.tsx";
import EditIcon from "@mui/icons-material/Edit";

interface Props {
    column: BoardColumnDto;
    editMode?: boolean;
    onDelete?: (columnId: number) => void;
    onCreateTask?: (columnId: number) => void;
    onTaskClick: (taskId: number) => void;
    onEditColumn: (id: number, name: string) => void;
}

function BoardColumn({ column, editMode, onDelete, onEditColumn, onCreateTask, onTaskClick }: Props) {
    return (
        <Paper
            elevation={0}
            sx={{
                width: 320,
                minWidth: 320,
                maxHeight: "calc(100vh - 240px)",
                display: "flex",
                flexDirection: "column",
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "#FFFFFF",
                boxShadow: "0 4px 12px rgba(0,0,0,0.02)"
            }}
        >
            {/* Шапка колонки */}
            <Stack
                direction="row"
                sx={{
                    p: 2,
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid",
                    borderColor: "divider"
                }}
            >
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "text.primary" }}>
                        {column.name}
                    </Typography>
                    <Box sx={{ bgcolor: "action.hover", px: 1, py: 0.2, borderRadius: 1.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary" }}>
                            {column.tasks?.length || 0}
                        </Typography>
                    </Box>
                </Stack>

                {editMode && (
                    <Stack direction="row" spacing={1} sx={{ alignItems: "right" }}>
                        <IconButton onClick={() => onEditColumn(column.id, column.name)}>
                            <EditIcon fontSize="small" />
                        </IconButton>

                        <IconButton color="error" onClick={() => onDelete?.(column.id)}>
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Stack>
                )}
            </Stack>

            {/* Зона Droppable для задач внутри колонки */}
            <Droppable droppableId={String(column.id)} type="task">
                {(provided, snapshot) => (
                    <Box
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        sx={{
                            p: 2,
                            display: "flex",
                            flexDirection: "column",
                            gap: 1.5,
                            overflowY: "auto",
                            flexGrow: 1,
                            bgcolor: snapshot.isDraggingOver ? "rgba(53, 91, 61, 0.02)" : "transparent",
                            transition: "background-color 0.2s ease"
                        }}
                    >
                        {column.tasks?.map((task, index) => (
                            <Draggable
                                key={task.id}
                                draggableId={`task-${task.id}`}
                                index={index}
                            >
                                {(provided, snapshot) => (
                                    <Box
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        sx={{
                                            ...provided.draggableProps.style,
                                            userSelect: "none",
                                            mb: 0.5,
                                            opacity: snapshot.isDragging ? 0.9 : 1
                                        }}
                                    >
                                        <TaskCard task={task} onClick={() => onTaskClick(task.id)} />
                                    </Box>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </Box>
                )}
            </Droppable>

            {/* Нижняя кнопка добавления */}
            <Box sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}>
                <Button
                    fullWidth
                    variant="text"
                    startIcon={<AddIcon />}
                    onClick={() => onCreateTask?.(column.id)}
                    sx={{
                        textTransform: "none",
                        borderRadius: 2,
                        color: "text.secondary",
                        justifyContent: "flex-start",
                        "&:hover": { bgcolor: "action.hover", color: "primary.main" }
                    }}
                >
                    Добавить задачу
                </Button>
            </Box>
        </Paper>
    );
}

export default BoardColumn;