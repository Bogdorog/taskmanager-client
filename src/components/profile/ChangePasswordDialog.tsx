import { useState } from "react";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, CircularProgress } from "@mui/material";
import { changePassword } from "@/api/userApi.ts";
import { getApiErrorMessage } from "@/utils/apiError.ts";

function ChangePasswordDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!currentPassword || !newPassword) {
            setError("Заполните все поля");
            return;
        }
        try {
            setLoading(true);
            setError("");
            await changePassword({ currentPassword, newPassword });
            setSuccess("Пароль успешно изменен");
            setCurrentPassword("");
            setNewPassword("");
            setTimeout(() => {
                setSuccess("");
                onClose();
            }, 1500);
        } catch (err: unknown) {
            setError(getApiErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ fontWeight: 600 }}>Смена пароля</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    type="password"
                    label="Текущий пароль"
                    margin="normal"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    disabled={loading}
                />
                <TextField
                    fullWidth
                    type="password"
                    label="Новый пароль"
                    margin="normal"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={loading}
                />
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
            </DialogContent>
            <DialogActions sx={{ p: 2.5 }}>
                <Button onClick={onClose} disabled={loading}>Отмена</Button>
                <Button variant="contained" onClick={handleSubmit} disabled={loading}>
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Сохранить"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ChangePasswordDialog;