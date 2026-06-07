import React, { useState } from "react";
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField, Grid
} from "@mui/material";
import AddCheckIcon from "@mui/icons-material/AssignmentTurnedIn";
import type { TaskPriority } from "@/types/task";
import type {CompanyMembershipDto} from "@/types/company.ts";

interface Props {
    open: boolean;
    users: CompanyMembershipDto[];
    onClose: () => void;
    onSubmit: (
        title: string,
        description: string,
        priority: TaskPriority,
        assignedUserId: number | null,
        dueDate: string | null
    ) => void | Promise<void>;
}

function CreateTaskDialog({ open, users, onClose, onSubmit }: Props) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<TaskPriority>("MEDIUM");
    const [assignedUserId, setAssignedUserId] = useState<string>(""); // Используем string для корректной работы MenuItem с пустым значением
    const [dueDate, setDueDate] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!title.trim()) return;

        // Конвертируем пустую строку обратно в null для бэкенда
        const userIdParam = assignedUserId ? Number(assignedUserId) : null;
        const dueDateParam = dueDate || null;

        await onSubmit(title.trim(), description.trim(), priority, userIdParam, dueDateParam);
        handleClear();
    }

    function handleClear() {
        setTitle("");
        setDescription("");
        setPriority("MEDIUM");
        setAssignedUserId("");
        setDueDate("");
        onClose();
    }

    return (
        <Dialog
            open={open}
            onClose={handleClear}
            maxWidth="sm"
            fullWidth
            slotProps={{
                paper: {
                    component: "form",
                    onSubmit: handleSubmit,
                    sx: { borderRadius: 3, p: 1 }
                }
            }}
        >
            <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>Новая задача</DialogTitle>

            <DialogContent sx={{ pt: 1 }}>
                <TextField
                    fullWidth
                    required
                    margin="normal"
                    label="Название задачи"
                    placeholder="Что необходимо сделать?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <TextField
                    fullWidth
                    multiline
                    rows={3}
                    margin="normal"
                    label="Описание"
                    placeholder="Добавьте детали, ссылки, чек-листы или критерии приемки"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            select
                            fullWidth
                            label="Исполнитель"
                            value={assignedUserId}
                            onChange={(e) => setAssignedUserId(e.target.value)}
                        >
                            <MenuItem value=""><em>Не назначен</em></MenuItem>
                            {users.map((user) => (
                                <MenuItem key={user.user.id} value={user.user.id}>
                                    {user.user.fullName} ({user.role.name})
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            label="Срок выполнения"
                            type="datetime-local"
                            fullWidth
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            slotProps={{
                                inputLabel: { shrink: true }
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <TextField
                            select
                            fullWidth
                            label="Уровень приоритета"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value as TaskPriority)}
                        >
                            <MenuItem value="LOW">🟢 Низкий</MenuItem>
                            <MenuItem value="MEDIUM">🔵 Средний</MenuItem>
                            <MenuItem value="HIGH">🟡 Высокий</MenuItem>
                            <MenuItem value="CRITICAL">🔴 Критический</MenuItem>
                        </TextField>
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 2, px: 3 }}>
                <Button onClick={handleClear} sx={{ textTransform: "none", borderRadius: 2 }}>
                    Отмена
                </Button>

                <Button
                    type="submit"
                    variant="contained"
                    startIcon={<AddCheckIcon />}
                    disabled={!title.trim()}
                    sx={{ textTransform: "none", borderRadius: 2, px: 3 }}
                >
                    Создать
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default CreateTaskDialog;