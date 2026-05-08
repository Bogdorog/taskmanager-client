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

import { register } from "@/api/authApi";

function RegisterPage() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        login: "",
        fullName: "",
        phone: "",
        email: "",
        address: "",
        password: "",
    });

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

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
            setSuccess("");

            await register(formData);

            setSuccess(
                "Регистрация прошла успешно!"
            );

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (err: any) {

            setError(
                err?.response?.data?.message ||
                "Ошибка регистрации"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            mt={5}
        >
            <Paper
                elevation={3}
                sx={{
                    padding: 4,
                    width: 500,
                }}
            >

                <Typography
                    variant="h5"
                    mb={3}
                    textAlign="center"
                >
                    Регистрация
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
                        label="ФИО"
                        name="fullName"
                        margin="normal"
                        value={formData.fullName}
                        onChange={handleChange}
                    />

                    <TextField
                        fullWidth
                        label="Телефон"
                        name="phone"
                        margin="normal"
                        value={formData.phone}
                        onChange={handleChange}
                    />

                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        margin="normal"
                        value={formData.email}
                        onChange={handleChange}
                    />

                    <TextField
                        fullWidth
                        label="Адрес"
                        name="address"
                        margin="normal"
                        value={formData.address}
                        onChange={handleChange}
                    />

                    <TextField
                        fullWidth
                        label="Пароль"
                        name="password"
                        type="password"
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

                    {success && (
                        <Alert
                            severity="success"
                            sx={{ mt: 2 }}
                        >
                            {success}
                        </Alert>
                    )}

                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        sx={{ mt: 3 }}
                        disabled={loading}
                    >
                        Зарегистрироваться
                    </Button>

                </form>
            </Paper>
        </Box>
    );
}

export default RegisterPage;