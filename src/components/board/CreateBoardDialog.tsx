import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Alert, CircularProgress } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query"; // Импортируем клиент кэша

import { createBoard } from "@/api/boardApi";
import { getApiErrorMessage } from "@/utils/apiError";

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: () => Promise<void>;
    companyId: number;
}

function CreateBoardDialog({ open, onClose, onSubmit, companyId }: Props) {
    const queryClient = useQueryClient(); // Инициализируем клиент кэша
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!name.trim() || !companyId) return;

        try {
            setSubmitting(true);
            setError("");

            // Создаем доску на бэкенде
            await createBoard({
                companyId,
                name: name.trim(),
                description: description.trim(),
            });

            // Инвалидируем кэш TanStack Query
            await queryClient.invalidateQueries({
                queryKey: ["companyPage", companyId]
            });

            setName("");
            setDescription("");

            await onSubmit();
            onClose();
        } catch (err: unknown) {
            setError(getApiErrorMessage(err));
        } finally {
            setSubmitting(false);
        }
    }

    const handleCancel = () => {
        setName("");
        setDescription("");
        setError("");
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleCancel}
            maxWidth="xs"
            fullWidth
            slotProps={{
                paper: {
                    component: "form",
                    onSubmit: handleSubmit,
                    sx: { borderRadius: 3 }
                }
            }}
        >
            <DialogTitle sx={{ fontWeight: 700 }}>Создание новой доски</DialogTitle>

            <DialogContent>
                {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

                <TextField
                    fullWidth
                    required
                    label="Название доски"
                    placeholder="Например: Разработка СRM, Маркетинг"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    margin="normal"
                    disabled={submitting}
                />

                <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Описание проекта"
                    placeholder="Краткое описание целей доски или спринта"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    margin="normal"
                    disabled={submitting}
                />
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button onClick={handleCancel} disabled={submitting} sx={{ textTransform: "none", borderRadius: 2 }}>
                    Отмена
                </Button>

                <Button
                    type="submit"
                    variant="contained"
                    disabled={submitting || !name.trim()}
                    sx={{ textTransform: "none", borderRadius: 2, minWidth: 90 }}
                >
                    {submitting ? <CircularProgress size={20} color="inherit" /> : "Создать"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default CreateBoardDialog;