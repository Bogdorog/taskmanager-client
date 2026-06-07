import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Alert, Box, Button, Paper, TextField, Typography, CircularProgress } from "@mui/material";
import LockResetIcon from "@mui/icons-material/LockReset";

import { confirmPasswordReset } from "@/api/authApi";
import { getApiErrorMessage } from "@/utils/apiError";

function PasswordResetConfirmPage() {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const token = params.get("token") ?? "";

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!password || !confirmPassword) {
            setError("Заполните все поля");
            return;
        }

        if (password !== confirmPassword) {
            setError("Пароли не совпадают");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setSuccess("");

            await confirmPasswordReset(token, password);
            setSuccess("Пароль успешно изменен");

            setTimeout(() => {
                navigate("/login");
            }, 1500);
        } catch (err: unknown) {
            setError(getApiErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    // Рендер ошибки, если в URL отсутствует токен сброса
    if (!token) {
        return (
            <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", px: 2 }}>
                <Paper elevation={4} sx={{ p: 4, width: "100%", maxWidth: 420, borderRadius: 3, textAlign: "center" }}>
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                        Некорректная или устаревшая ссылка для сброса пароля.
                    </Alert>
                    <Button variant="contained" fullWidth onClick={() => navigate("/login")}>
                        Перейти на страницу входа
                    </Button>
                </Paper>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: "background.default",
                px: 2,
            }}
        >
            <Paper
                elevation={4}
                sx={{
                    p: 4,
                    width: "100%",
                    maxWidth: 420,
                    borderRadius: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Box
                    sx={{
                        bgcolor: "primary.main",
                        color: "white",
                        borderRadius: "50%",
                        p: 1.5,
                        mb: 2,
                        display: "flex",
                    }}
                >
                    <LockResetIcon />
                </Box>

                <Typography variant="h5" component="h1" sx={{ mb: 1, fontWeight: 700 }}>
                    Новый пароль
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", mb: 3 }}>
                    Придумайте сложный пароль, содержащий буквы и цифры.
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
                    <TextField
                        fullWidth
                        type="password"
                        label="Новый пароль"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (error) setError("");
                        }}
                        disabled={loading || !!success}
                    />

                    <TextField
                        fullWidth
                        type="password"
                        label="Повторите пароль"
                        autoComplete="new-password"
                        sx={{ mt: 2 }}
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            if (error) setError("");
                        }}
                        disabled={loading || !!success}
                    />

                    {error && <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mt: 2, borderRadius: 2 }}>{success}</Alert>}

                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        size="large"
                        sx={{ mt: 3, height: 46, borderRadius: 2 }}
                        disabled={loading || !!success}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Сменить пароль"}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}

export default PasswordResetConfirmPage;