import { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField, Alert, CircularProgress } from "@mui/material";
import { inviteUser } from "@/api/companyApi";
import { getApiErrorMessage } from "@/utils/apiError";
import type { CompanyRoleDto } from "@/types/company";

interface InviteMemberDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => Promise<void>;
    companyId: number;
    roles: CompanyRoleDto[];
}

function InviteMemberDialog({ open, onClose, onSuccess, companyId, roles }: InviteMemberDialogProps) {
    const [login, setLogin] = useState(""); // Изменено: стейт под логин
    const [roleId, setRoleId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleInvite = async () => {
        if (!login.trim() || !roleId) {
            setError("Пожалуйста, заполните все поля");
            return;
        }

        try {
            setLoading(true);
            setError("");

            await inviteUser(companyId, {
                user: login.trim(),
                roleId: Number(roleId),
            });

            // Сбрасываем форму
            setLogin("");
            setRoleId("");

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
        setLogin("");
        setRoleId("");
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="xs">
            <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>Пригласить участника</DialogTitle>

            <DialogContent>
                {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

                <TextField
                    fullWidth
                    label="Логин пользователя"
                    margin="normal"
                    placeholder="Введите логин (например: ivan_dev)"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    disabled={loading}
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
                    disabled={loading || !login.trim() || !roleId}
                    sx={{ textTransform: "none", borderRadius: 2, minWidth: 110, height: 36 }}
                >
                    {loading ? <CircularProgress size={20} color="inherit" /> : "Пригласить"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default InviteMemberDialog;