import React, { useState, useEffect } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

interface Props {
    open: boolean;
    initialName: string;
    onClose: () => void;
    onSubmit: (newName: string) => void | Promise<void>;
}

function EditColumnDialog({ open, initialName, onClose, onSubmit }: Props) {
    const [name, setName] = useState(initialName);

    // Синхронизируем внутренний стейт, когда диалог открывается для другой колонки
    useEffect(() => {
        if (open) {
            setName(initialName);
        }
    }, [open, initialName]);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!name.trim()) return;

        onSubmit(name.trim());
        onClose();
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            slotProps={{
                paper: {
                    component: "form",
                    onSubmit: handleSubmit,
                    sx: { borderRadius: 3, p: 1 }
                }
            }}
        >
            <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>Переименовать колонку</DialogTitle>

            <DialogContent sx={{ pt: 1 }}>
                <TextField
                    fullWidth
                    required
                    margin="normal"
                    label="Название колонки"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                />
            </DialogContent>

            <DialogActions sx={{ p: 2, px: 3 }}>
                <Button onClick={onClose} sx={{ textTransform: "none", borderRadius: 2 }}>
                    Отмена
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    disabled={!name.trim() || name.trim() === initialName}
                    sx={{ textTransform: "none", borderRadius: 2 }}
                >
                    Сохранить
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default EditColumnDialog;