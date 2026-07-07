import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Button, Paper, TextField, Typography, CircularProgress, Divider, Grid } from "@mui/material";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import { register } from "@/api/authApi";
import { getApiErrorMessage } from "@/utils/apiError";

function RegisterPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        login: "",
        lastName: "",
        firstName: "",
        middleName: "",
        phone: "",
        email: "",
        country: "",
        region: "",
        city: "",
        street: "",
        house: "",
        apartment: "",
        password: "",
    });

    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const validateField = (name: string, value: string) => {
        let errorMsg = "";

        if (name === "login" && value.trim()) {
            if (/[А-Яа-яЁё]/.test(value)) {
                errorMsg = "Логин не должен содержать кириллицу";
            } else if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
                errorMsg = "Разрешены только латиница, цифры, дефис и подчёркивание";
            }
        }

        if (["lastName", "firstName", "middleName"].includes(name) && value.trim()) {
            if (/[^А-Яа-яЁё\s-]/.test(value)) {
                errorMsg = "Разрешены только русские буквы, пробелы и дефисы";
            }
        }

        if (name === "email" && value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorMsg = "Некорректный формат Email";
            }
        }

        if (name === "phone" && value.trim()) {
            const digitsCount = value.replace(/\D/g, "").length;
            if (digitsCount !== 11) {
                errorMsg = "Номер телефона должен содержать ровно 11 цифр";
            }
        }

        if (name === "login" && value.trim()) {
            const passwordRegex = /^[a-zA-Z0-9!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]+$/;
            if (!passwordRegex.test(value)) {
                errorMsg = "Логин может содержать только английские буквы, цифры и спецсимволы";
            }
        }

        if (name === "password" && value.trim()) {
            const passwordRegex = /^[a-zA-Zа-яА-ЯёЁ0-9!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]+$/;
            if (!passwordRegex.test(value)) {
                errorMsg = "Пароль может содержать только английские буквы, русские буквы, цифры и спецсимволы";
            }
        }

        setFieldErrors((prev) => ({
            ...prev,
            [name]: errorMsg,
        }));
    };

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        if (error) setError("");

        if (name === "phone") {
            const digits = value.replace(/\D/g, "").slice(0, 11);
            let formatted = digits;

            if (digits.length > 0) {
                if (digits.length <= 1) {
                    formatted = digits;
                } else if (digits.length <= 4) {
                    formatted = `${digits[0]}-(${digits.slice(1)}`;
                } else if (digits.length <= 7) {
                    formatted = `${digits[0]}-(${digits.slice(1, 4)})-${digits.slice(4)}`;
                } else if (digits.length <= 9) {
                    formatted = `${digits[0]}-(${digits.slice(1, 4)})-${digits.slice(4, 7)}-${digits.slice(7)}`;
                } else {
                    formatted = `${digits[0]}-(${digits.slice(1, 4)})-${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
                }
            }

            setFormData((prev) => ({ ...prev, phone: formatted }));
            validateField(name, formatted);
            return;
        }

        setFormData((prev) => ({ ...prev, [name]: value }));
        // Запускаем валидацию для измененного поля
        validateField(name, value);
    }

    const isFormInvalid = Object.values(fieldErrors).some((msg) => msg !== "") ||
        !formData.login.trim() ||
        !formData.password.trim() ||
        !formData.lastName.trim() ||
        !formData.firstName.trim();

    function validateOnSubmit() {
        if (isFormInvalid) {
            setError("Пожалуйста, исправьте ошибки в полях и заполните обязательные данные");
            return false;
        }
        return true;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!validateOnSubmit()) return;

        try {
            setLoading(true);

            const fullName = [formData.lastName, formData.firstName, formData.middleName]
                .filter(Boolean)
                .join(" ");

            const address = [
                formData.country,
                formData.region,
                formData.city,
                formData.street,
                formData.house ? `д. ${formData.house}` : null,
                formData.apartment ? `кв. ${formData.apartment}` : null,
            ]
                .filter(Boolean)
                .join(", ");

            const cleanPhone = formData.phone.replace(/\D/g, "");

            await register({
                login: formData.login,
                fullName,
                phone: cleanPhone,
                email: formData.email,
                address,
                password: formData.password,
            });

            setSuccess("Регистрация успешно завершена!");
            setTimeout(() => navigate("/login"), 1500);
        } catch (err: unknown) {
            setError(getApiErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: "background.default",
                py: { xs: 4, md: 6 },
                px: 2,
            }}
        >
            <Paper
                elevation={4}
                sx={{
                    width: "100%",
                    maxWidth: 750,
                    p: { xs: 3, sm: 5 },
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
                    <PersonAddOutlinedIcon />
                </Box>

                <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 700 }}>
                    Регистрация
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
                    <Grid container spacing={2.5}>

                        {/* Секция 1: Учетные данные */}
                        <Grid size={12}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "text.primary" }}>
                                Учетная запись
                            </Typography>
                            <Divider sx={{ mt: 0.5 }} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Логин"
                                name="login"
                                value={formData.login}
                                onChange={handleChange}
                                disabled={loading}
                                error={!!fieldErrors.login}
                                helperText={fieldErrors.login}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField fullWidth
                                       type="password"
                                       label="Пароль"
                                       name="password"
                                       value={formData.password}
                                       onChange={handleChange}
                                       disabled={loading}
                                       error={!!fieldErrors.password}
                                       helperText={fieldErrors.password} />
                        </Grid>

                        {/* Секция 2: Личные данные */}
                        <Grid size={12} sx={{ mt: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "text.primary" }}>
                                Личные данные
                            </Typography>
                            <Divider sx={{ mt: 0.5 }} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <TextField
                                fullWidth
                                label="Фамилия"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                disabled={loading}
                                error={!!fieldErrors.lastName}
                                helperText={fieldErrors.lastName}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <TextField
                                fullWidth
                                label="Имя"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                disabled={loading}
                                error={!!fieldErrors.firstName}
                                helperText={fieldErrors.firstName}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <TextField
                                fullWidth
                                label="Отчество"
                                name="middleName"
                                value={formData.middleName}
                                onChange={handleChange}
                                disabled={loading}
                                error={!!fieldErrors.middleName}
                                helperText={fieldErrors.middleName}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Телефон"
                                name="phone"
                                placeholder="7-(999)-999-99-99"
                                value={formData.phone}
                                onChange={handleChange}
                                disabled={loading}
                                error={!!fieldErrors.phone}
                                helperText={fieldErrors.phone}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                type="email"
                                label="Email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={loading}
                                error={!!fieldErrors.email}
                                helperText={fieldErrors.email}
                            />
                        </Grid>

                        {/* Секция 3: Адрес */}
                        <Grid size={12} sx={{ mt: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "text.primary" }}>
                                Адрес проживания (необязательно)
                            </Typography>
                            <Divider sx={{ mt: 0.5 }} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField fullWidth label="Страна" name="country" value={formData.country} onChange={handleChange} disabled={loading} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField fullWidth label="Область / Регион" name="region" value={formData.region} onChange={handleChange} disabled={loading} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField fullWidth label="Город" name="city" value={formData.city} onChange={handleChange} disabled={loading} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField fullWidth label="Улица" name="street" value={formData.street} onChange={handleChange} disabled={loading} />
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3 }}>
                            <TextField fullWidth label="Дом" name="house" value={formData.house} onChange={handleChange} disabled={loading} />
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3 }}>
                            <TextField fullWidth label="Кв. / Офис" name="apartment" value={formData.apartment} onChange={handleChange} disabled={loading} />
                        </Grid>
                    </Grid>

                    {error && <Alert severity="error" sx={{ mt: 3, borderRadius: 2 }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mt: 3, borderRadius: 2 }}>{success}</Alert>}

                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        size="large"
                        sx={{ mt: 4, height: 48, borderRadius: 2, fontSize: "1rem" }}
                        disabled={loading || !!success || isFormInvalid}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Зарегистрироваться"}
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
                    Уже есть аккаунт? Войти
                </Button>
            </Paper>
        </Box>
    );
}

export default RegisterPage;