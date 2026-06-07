import React, { useState } from "react";
import { Alert, Box, Button, Paper, TextField, Grid, CircularProgress } from "@mui/material";
import { useProfile } from "@/hooks/useProfile";
import { getApiErrorMessage } from "@/utils/apiError.ts";
import UserAvatar from "@/components/profile/UserAvatar.tsx";
import AvatarUpload from "@/components/profile/AvatarUpload.tsx";

function ProfileEditForm({ onCancel }: { onCancel: () => void }) {
    const { user, updateProfile, uploadAvatar, removeAvatar, isUpdating, isUploading } = useProfile();

    const [formData, setFormData] = useState({
        fullName: user?.fullName || "",
        phone: user?.phone || "",
        email: user?.email || "",
        address: user?.address || "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setError("");
            await updateProfile(formData);
            setSuccess("Профиль успешно обновлен");
            setTimeout(() => onCancel(), 1000);
        } catch (err) {
            setError(getApiErrorMessage(err));
        }
    };

    const handleAvatarDelete = async () => {
        if (!window.confirm("Вы уверены, что хотите удалить аватар?")) return;
        try {
            setError("");
            await removeAvatar();
            setSuccess("Аватар успешно удален");
        } catch (err) {
            setError(getApiErrorMessage(err));
        }
    };

    if (!user) return null;

    return (
        <Paper elevation={3} sx={{ width: "100%", maxWidth: 850, p: 5, borderRadius: 5 }}>
            {/* Исправлено: alignItems вместо alignOnItems */}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 4 }}>
                <Box sx={{ position: "relative" }}>
                    <UserAvatar user={user} size={120} />
                    {isUploading && (
                        <CircularProgress
                            size={120}
                            sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                zIndex: 1,
                                color: "primary.main"
                            }}
                        />
                    )}
                </Box>

                {/* Передаем функции загрузки и удаления */}
                <AvatarUpload
                    onUpload={async (file) => {
                        try {
                            setError("");
                            await uploadAvatar(file);
                            setSuccess("Фото профиля обновлено");
                            console.log(user.avatarUrl);
                        } catch (err) {
                            setError(getApiErrorMessage(err));
                        }
                    }}
                    onDelete={handleAvatarDelete}
                    showDelete={!!user.avatarUrl} // Показываем кнопку удаления только если аватар есть
                    disabled={isUploading}
                />
            </Box>

            <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField fullWidth label="ФИО" name="fullName" value={formData.fullName} onChange={handleChange} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField fullWidth label="Email" name="email" value={formData.email} onChange={handleChange} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField fullWidth label="Телефон" name="phone" value={formData.phone} onChange={handleChange} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField fullWidth label="Адрес" name="address" value={formData.address} onChange={handleChange} />
                    </Grid>
                </Grid>

                {error && <Alert severity="error" sx={{ mt: 3, borderRadius: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mt: 3, borderRadius: 2 }}>{success}</Alert>}

                <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
                    <Button type="submit" variant="contained" disabled={isUpdating || isUploading} sx={{ px: 4, borderRadius: 3 }}>
                        {isUpdating ? "Сохранение..." : "Сохранить"}
                    </Button>
                    <Button variant="outlined" onClick={onCancel} disabled={isUpdating || isUploading} sx={{ borderRadius: 3 }}>
                        Отмена
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
}

export default ProfileEditForm;