import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Button, Paper, TextField, Typography, CircularProgress } from "@mui/material";
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';

import { requestPasswordReset } from "@/api/authApi";
import { getApiErrorMessage } from "@/utils/apiError";

function PasswordResetPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if (error) setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim()) {
            setError("Пожалуйста, введите корректный Email");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setSuccess("");

            await requestPasswordReset(email);
            setSuccess("Инструкция по восстановлению пароля отправлена на указанную почту.");
        } catch (err: unknown) {
            setError(getApiErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

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
                    <MailOutlinedIcon />
                </Box>

                <Typography variant="h5" component="h1" sx={{ mb: 1, fontWeight: 700 }}>
                    Восстановление пароля
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", mb: 3 }}>
                    Введите ваш Email, и мы отправим вам ссылку для сброса пароля.
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
                    <TextField
                        fullWidth
                        type="email"
                        label="Email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={handleChange}
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
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Отправить письмо"}
                    </Button>
                </Box>

                <Button
                    fullWidth
                    variant="text"
                    size="small"
                    sx={{ mt: 2, color: "text.secondary" }}
                    onClick={() => navigate("/login")}
                    disabled={loading}
                >
                    Вернуться
                </Button>
            </Paper>
        </Box>
    );
}

export default PasswordResetPage;