import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Button, Paper, TextField, Typography, CircularProgress } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import { login } from "@/api/authApi";
import { useAuth } from "@/hooks/useAuth";
import { getApiErrorMessage } from "@/utils/apiError.ts";
import { useCompany } from "@/hooks/useCompany.ts";

function LoginPage() {
    const navigate = useNavigate();
    const auth = useAuth();
    const { refreshCompanies } = useCompany();

    const [formData, setFormData] = useState({ login: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        if (error) setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Клиентская валидация
        if (!formData.login.trim() || !formData.password.trim()) {
            setError("Пожалуйста, заполните все поля");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await login(formData);
            auth.login(response);

            await refreshCompanies();
            navigate("/companies");
        } catch (err: unknown) {
            setError(getApiErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                bgcolor: "background.default",
            }}
        >
            <Paper
                elevation={4}
                sx={{
                    padding: 4,
                    width: "100%",
                    maxWidth: 400,
                    borderRadius: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                {/* Иконка для красоты интерфейса */}
                <Box
                    sx={{
                        bgcolor: "primary.main",
                        color: "white",
                        borderRadius: "50%",
                        p: 1,
                        mb: 1,
                        display: "flex",
                    }}
                >
                    <LockOutlinedIcon />
                </Box>

                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        mb: 3,
                        fontWeight: 700,
                    }}
                >
                    Вход
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
                    <TextField
                        fullWidth
                        label="Логин или Email"
                        name="login"
                        margin="normal"
                        autoComplete="username"
                        autoFocus
                        value={formData.login}
                        onChange={handleChange}
                        disabled={loading}
                    />

                    <TextField
                        fullWidth
                        type="password"
                        label="Пароль"
                        name="password"
                        margin="normal"
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={loading}
                    />

                    {error && (
                        <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        size="large"
                        sx={{ mt: 3, height: 46 }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Войти"}
                    </Button>
                </Box>

                <Button
                    fullWidth
                    variant="text"
                    size="small"
                    sx={{ mt: 2, color: "text.secondary" }}
                    onClick={() => navigate("/password-reset")}
                    disabled={loading}
                >
                    Забыли пароль?
                </Button>
            </Paper>
        </Box>
    );
}

export default LoginPage;