import React, { useState } from "react";
import { Box, Button, Paper, TextField, Typography, CircularProgress, Stack } from "@mui/material";
import type { CreateCompanyRequest } from "@/types/company";

interface CompanyFormEditProps {
    onSubmit: (data: CreateCompanyRequest) => Promise<void>;
    isLoading: boolean;
    defaultValues: CreateCompanyRequest;
}

function CompanyFormEdit({ onSubmit, isLoading, defaultValues }: CompanyFormEditProps) {
    const [formData, setFormData] = useState<CreateCompanyRequest>(defaultValues);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <Paper elevation={3} sx={{ maxWidth: 650, mx: "auto", p: { xs: 3, sm: 5 }, borderRadius: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                Редактирование компании
            </Typography>

            <Box component="form" onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }}>
                <TextField fullWidth required label="Название" name="name" margin="normal" value={formData.name} onChange={handleChange} disabled={isLoading} />
                <TextField fullWidth label="Описание" name="description" margin="normal" multiline minRows={3} value={formData.description} onChange={handleChange} disabled={isLoading} />
                <TextField fullWidth label="Email" name="email" margin="normal" value={formData.email} onChange={handleChange} disabled={isLoading} />
                <TextField fullWidth label="Телефон" name="phone" margin="normal" value={formData.phone} onChange={handleChange} disabled={isLoading} />
                <TextField fullWidth label="Адрес" name="address" margin="normal" value={formData.address} onChange={handleChange} disabled={isLoading} />

                <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                    <Button type="submit" variant="contained" size="large" disabled={isLoading || !formData.name.trim()} sx={{ borderRadius: 2.5, textTransform: "none", px: 4, height: 46 }}>
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : "Сохранить изменения"}
                    </Button>
                </Stack>
            </Box>
        </Paper>
    );
}

export default CompanyFormEdit;