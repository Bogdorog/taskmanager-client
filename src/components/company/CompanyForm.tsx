import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Paper, TextField, Typography, CircularProgress, Stack } from "@mui/material";
import type { CreateCompanyRequest } from "@/types/company";

interface CompanyFormProps {
    onSubmit: (data: CreateCompanyRequest) => Promise<void>;
    isLoading?: boolean; // Принимаем состояние загрузки из CreateCompanyPage
}

function CompanyForm({ onSubmit, isLoading = false }: CompanyFormProps) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<CreateCompanyRequest>({
        name: "",
        description: "",
        email: "",
        phone: "",
        address: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <Paper
            elevation={3}
            sx={{
                maxWidth: 650,
                mx: "auto",
                p: { xs: 3, sm: 5 },
                borderRadius: 4,
                mt: 4,
            }}
        >
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                Создание компании
            </Typography>

            <Box
                component="form"
                onSubmit={(e) => {
                    e.preventDefault();
                    if (!formData.name.trim()) return;
                    onSubmit(formData);
                }}
            >
                <TextField
                    fullWidth
                    required
                    label="Название компании"
                    name="name"
                    margin="normal"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isLoading}
                />

                <TextField
                    fullWidth
                    label="Описание деятельности"
                    name="description"
                    margin="normal"
                    multiline
                    minRows={3}
                    value={formData.description}
                    onChange={handleChange}
                    disabled={isLoading}
                />

                <TextField
                    fullWidth
                    label="Email организации"
                    name="email"
                    margin="normal"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                />

                <TextField
                    fullWidth
                    label="Контактный телефон"
                    name="phone"
                    margin="normal"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={isLoading}
                />

                <TextField
                    fullWidth
                    label="Юридический / Фактический адрес"
                    name="address"
                    margin="normal"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={isLoading}
                />

                <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={isLoading || !formData.name.trim()}
                        sx={{
                            borderRadius: 2.5,
                            textTransform: "none",
                            px: 4,
                            height: 46,
                        }}
                    >
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : "Создать компанию"}
                    </Button>

                    <Button
                        variant="outlined"
                        size="large"
                        onClick={() => navigate("/companies")}
                        disabled={isLoading}
                        sx={{
                            borderRadius: 2.5,
                            textTransform: "none",
                        }}
                    >
                        Отмена
                    </Button>
                </Stack>
            </Box>
        </Paper>
    );
}

export default CompanyForm;