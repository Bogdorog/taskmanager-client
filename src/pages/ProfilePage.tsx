import {
    Box,
    CircularProgress,
} from "@mui/material";

import { useEffect, useState }
    from "react";

import {
    getCurrentUser
} from "@/api/userApi";

import type {
    UserDto
} from "@/types/user";

import ProfileView
    from "@/components/profile/ProfileView";

import ProfileEditForm
    from "@/components/profile/ProfileEditForm";

import ChangePasswordDialog
    from "@/components/profile/ChangePasswordDialog";

function ProfilePage() {

    const [user,
        setUser] =
        useState<UserDto | null>(null);

    const [loading,
        setLoading] =
        useState(true);

    const [editMode,
        setEditMode] =
        useState(false);

    const [passwordDialogOpen,
        setPasswordDialogOpen] =
        useState(false);

    const loadUser = async () => {

        try {

            const data =
                await getCurrentUser();

            setUser(data);

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {

        loadUser();

    }, []);

    if (loading || !user) {

        return (
            <CircularProgress />
        );
    }

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
            }}
        >

            {editMode ? (

                <ProfileEditForm
                    user={user}
                    onCancel={() =>
                        setEditMode(false)
                    }
                    onSave={(updated) => {

                        setUser(updated);

                        setEditMode(false);
                    }}
                />

            ) : (

                <ProfileView
                    user={user}
                    onEdit={() =>
                        setEditMode(true)
                    }
                    onChangePassword={() =>
                        setPasswordDialogOpen(
                            true
                        )
                    }
                />

            )}

            <ChangePasswordDialog
                open={passwordDialogOpen}
                onClose={() =>
                    setPasswordDialogOpen(
                        false
                    )
                }
            />

        </Box>
    );
}

export default ProfilePage;