import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";

import { useState } from "react";

import { changePassword }
    from "@/api/userApi.ts";
import {getApiErrorMessage} from "@/utils/apiError.ts";

function ChangePasswordDialog({
                                  open,
                                  onClose,
                              }: {
    open: boolean;
    onClose: () => void;
}) {

    const [currentPassword,
        setCurrentPassword] = useState("");

    const [newPassword,
        setNewPassword] = useState("");

    const [error,
        setError] = useState("");

    const [success,
        setSuccess] = useState("");

    const handleSubmit = async () => {

        try {

            setError("");

            await changePassword({
                currentPassword,
                newPassword,
            });

            setSuccess(
                "Пароль успешно изменен"
            );

            setTimeout(() => {
                onClose();
            }, 1000);

        } catch (error: unknown) {
            setError(getApiErrorMessage(error));
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
        >

            <DialogTitle>
                Смена пароля
            </DialogTitle>

            <DialogContent>

                <TextField
                    fullWidth
                    type="password"
                    label="Текущий пароль"
                    margin="normal"
                    value={currentPassword}
                    onChange={(e) =>
                        setCurrentPassword(
                            e.target.value
                        )
                    }
                />

                <TextField
                    fullWidth
                    type="password"
                    label="Новый пароль"
                    margin="normal"
                    value={newPassword}
                    onChange={(e) =>
                        setNewPassword(
                            e.target.value
                        )
                    }
                />

                {error && (
                    <Alert severity="error">
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success">
                        {success}
                    </Alert>
                )}

            </DialogContent>

            <DialogActions>

                <Button onClick={onClose}>
                    Отмена
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSubmit}
                >
                    Сохранить
                </Button>

            </DialogActions>

        </Dialog>
    );
}

export default ChangePasswordDialog;