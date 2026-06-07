import { useState } from "react";
import { Box, CircularProgress, Alert } from "@mui/material";
import { useProfile } from "@/hooks/useProfile";

import ProfileView from "@/components/profile/ProfileView";
import ProfileEditForm from "@/components/profile/ProfileEditForm";
import ChangePasswordDialog from "@/components/profile/ChangePasswordDialog";
import BackButton from "@/components/utils/BackButton.tsx";

function ProfilePage() {
    const { user, isLoading, error, logout } = useProfile();
    const [editMode, setEditMode] = useState(false);
    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !user) {
        return (
            <Box sx={{ p: 5 }}><Alert severity="error">Ошибка загрузки профиля</Alert></Box>
        );
    }

    return (
        <Box sx={{ display: "flex", justifyContent: "center", position: "relative", pt: 6 }}>
            <Box sx={{ position: "absolute", left: 0, top: 0 }}>
                <BackButton />
            </Box>

            {editMode ? (
                <ProfileEditForm onCancel={() => setEditMode(false)} />
            ) : (
                <ProfileView
                    user={user}
                    onEdit={() => setEditMode(true)}
                    onChangePassword={() => setPasswordDialogOpen(true)}
                    onLogout={logout}
                />
            )}

            <ChangePasswordDialog
                open={passwordDialogOpen}
                onClose={() => setPasswordDialogOpen(false)}
            />
        </Box>
    );
}

export default ProfilePage;