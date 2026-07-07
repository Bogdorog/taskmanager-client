import { useState } from "react";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, CircularProgress } from "@mui/material";
import { changePassword } from "@/api/userApi.ts";
import { getApiErrorMessage } from "@/utils/apiError.ts";

function ChangePasswordDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState(""); // Второе поле для подтверждения
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    // Очистка всех полей при закрытии диалога
    const handleClose = () => {
        if (loading) return;
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setError("");
        setSuccess("");
        onClose();
    };

    const handleSubmit = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            setError("Заполните все поля");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("Новые пароли не совпадают");
            return;
        }
        // Валидация состава пароля (английские, русские буквы, цифры и спецсимволы)
        const passwordRegex = /^[a-zA-Zа-яА-ЯёЁ0-9!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]+$/;
        if (!passwordRegex.test(newPassword)) {
            setError("Пароль может содержать только английские буквы, русские буквы, цифры и спецсимволы");
            return;
        }

        try {
            setLoading(true);
            setError("");
            await changePassword({ oldPassword: currentPassword, newPassword });
            setSuccess("Пароль успешно изменен");

            // Сброс состояния
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            setTimeout(() => {
                setSuccess("");
                handleClose();
            }, 1500);
        } catch (err: unknown) {
            setError(getApiErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={loading ? undefined : handleClose} maxWidth="xs" fullWidth>
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
                <TextField
                    fullWidth
                    type="password"
                    label="Повторите новый пароль"
                    margin="normal"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                />
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
            </DialogContent>
            <DialogActions sx={{ p: 2.5 }}>
                <Button onClick={handleClose} disabled={loading}>Отмена</Button>
                <Button variant="contained" onClick={handleSubmit} disabled={loading}>
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Сохранить"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ChangePasswordDialog;