import {
    Alert,
    Box,
    Button,
    Paper,
    TextField,
    Typography,
} from "@mui/material";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login } from "@/api/authApi";
import { useAuth } from "@/context/AuthContext";
import {getApiErrorMessage} from "@/utils/apiError.ts";

function LoginPage() {

    const navigate = useNavigate();

    const auth = useAuth();

    const [formData, setFormData] = useState({
        login: "",
        password: "",
    });

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        try {

            setLoading(true);
            setError("");

            const response = await login(formData);

            auth.login(response);

            navigate("/");

        } catch (error: unknown) {
            setError(getApiErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                mt: 10,
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    padding: 4,
                    width: 400,
                }}
            >
                <Typography
                    sx={{
                        variant: "h5",
                        mb: 3,
                        textAlign: "center",
                    }}
                >
                    Вход
                </Typography>

                <form onSubmit={handleSubmit}>

                    <TextField
                        fullWidth
                        label="Логин"
                        name="login"
                        margin="normal"
                        value={formData.login}
                        onChange={handleChange}
                    />

                    <TextField
                        fullWidth
                        type="password"
                        label="Пароль"
                        name="password"
                        margin="normal"
                        value={formData.password}
                        onChange={handleChange}
                    />

                    {error && (
                        <Alert
                            severity="error"
                            sx={{ mt: 2 }}
                        >
                            {error}
                        </Alert>
                    )}

                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        sx={{ mt: 3 }}
                        disabled={loading}
                    >
                        Войти
                    </Button>

                </form>
            </Paper>
        </Box>
    );
}

export default LoginPage;