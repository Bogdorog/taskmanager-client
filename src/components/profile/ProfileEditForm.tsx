import {
    Alert,
    Box,
    Button,
    Paper,
    TextField,
} from "@mui/material";

import { useState } from "react";

import {
    updateProfile,
    uploadAvatar,
} from "@/api/userApi.ts";

import type {
    UserDto,
    UpdateProfileRequest,
} from "@/types/user.ts";

import UserAvatar
    from "@/components/profile/UserAvatar.tsx";

import AvatarUpload
    from "@/components/profile/AvatarUpload.tsx";
import {getApiErrorMessage} from "@/utils/apiError.ts";

function ProfileEditForm({
                             user,
                             onCancel,
                             onSave,
                         }: {
    user: UserDto;
    onCancel: () => void;
    onSave: (user: UserDto) => void;
}) {

    const [formData,
        setFormData] =
        useState<UpdateProfileRequest>({
            fullName: user.fullName,
            phone: user.phone,
            email: user.email,
            address: user.address,
        });

    const [error,
        setError] = useState("");

    const [success,
        setSuccess] = useState("");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        setFormData({
            ...formData,
            [e.target.name]:
            e.target.value,
        });
    };

    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        try {

            const updated =
                await updateProfile(
                    formData
                );

            onSave(updated);

            setSuccess(
                "Профиль обновлен"
            );

        } catch (error: unknown) {
            setError(getApiErrorMessage(error));
        }
    };

    const handleAvatarUpload =
        async (file: File) => {

            const updated =
                await uploadAvatar(file);

            onSave(updated);
        };

    return (
        <Paper
            elevation={3}
            sx={{
                p: 4,
                width: 600,
            }}
        >

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    mb: 3,
                }}
            >

                <UserAvatar user={user} />

                <AvatarUpload
                    onUpload={
                        handleAvatarUpload
                    }
                />

            </Box>

            <form onSubmit={handleSubmit}>

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

                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        mt: 3,
                    }}
                >

                    <Button
                        type="submit"
                        variant="contained"
                    >
                        Сохранить
                    </Button>

                    <Button
                        variant="outlined"
                        onClick={onCancel}
                    >
                        Отмена
                    </Button>

                </Box>

            </form>

        </Paper>
    );
}

export default ProfileEditForm;