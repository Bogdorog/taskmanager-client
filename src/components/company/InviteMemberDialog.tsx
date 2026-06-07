import { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField, Alert, CircularProgress } from "@mui/material";

import { inviteUser } from "@/api/companyApi";
import { getApiErrorMessage } from "@/utils/apiError";
import type { CompanyRoleDto } from "@/types/company";

interface InviteMemberDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => Promise<void>; // Изменение: коллбек обновления списка
    companyId: number;
    roles: CompanyRoleDto[];
}

function InviteMemberDialog({ open, onClose, onSuccess, companyId, roles }: InviteMemberDialogProps) {
    const [userId, setUserId] = useState("");
    const [roleId, setRoleId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleInvite = async () => {
        if (!userId || !roleId) {
            setError("Пожалуйста, заполните все поля");
            return;
        }

        try {
            setLoading(true);
            setError("");

            await inviteUser(companyId, {
                userId: Number(userId),
                roleId: Number(roleId),
            });

            // Сбрасываем форму
            setUserId("");
            setRoleId("");

            // Запускаем реактивное обновление списка в родителе
            await onSuccess();
            onClose();
        } catch (error: unknown) {
            setError(getApiErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setError("");
        setUserId("");
        setRoleId("");
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 3 } }}>
            <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>Пригласить участника</DialogTitle>

            <DialogContent>
                {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

                <TextField
                    fullWidth
                    label="ID пользователя"
                    margin="normal"
                    placeholder="Например: 12"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    disabled={loading}
                    slotProps={{ htmlInput: { inputMode: "numeric", pattern: "[0-9]*" } }} // Оптимизация под ввод цифр
                />

                <TextField
                    select
                    fullWidth
                    label="Назначаемая роль"
                    margin="normal"
                    value={roleId}
                    onChange={(e) => setRoleId(e.target.value)}
                    disabled={loading}
                >
                    {roles.map((role) => (
                        <MenuItem key={role.id} value={role.id}>
                            {role.name}
                        </MenuItem>
                    ))}
                </TextField>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button onClick={handleCancel} disabled={loading} sx={{ textTransform: "none", borderRadius: 2 }}>
                    Отмена
                </Button>

                <Button
                    variant="contained"
                    onClick={handleInvite}
                    disabled={loading || !userId || !roleId}
                    sx={{ textTransform: "none", borderRadius: 2, minWidth: 110, height: 36 }}
                >
                    {loading ? <CircularProgress size={20} color="inherit" /> : "Пригласить"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default InviteMemberDialog;