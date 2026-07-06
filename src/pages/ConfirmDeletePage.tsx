import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Box, Paper, Typography, Button, Alert, CircularProgress } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import { confirmAccountDeletion } from "@/api/userApi";
import { useProfile } from "@/hooks/useProfile";
import { getApiErrorMessage } from "@/utils/apiError";

function ConfirmDeletePage() {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const { logout } = useProfile(); // Очистка сессии после удаления

    const [error, setError] = useState("");
    const [isDeleted, setIsDeleted] = useState(false);

    const confirmMutation = useMutation({
        mutationFn: () => confirmAccountDeletion(token || ""),
        onSuccess: () => {
            setIsDeleted(true);
            setError("");
            // Ждем 3 секунды, чтобы пользователь прочитал сообщение, и разлогиниваем
            setTimeout(() => {
                logout();
                navigate("/login");
            }, 3500);
        },
        onError: (err) => {
            setError(getApiErrorMessage(err));
        }
    });

    function handleConfirm() {
        if (!token) {
            setError("Токен удаления отсутствует или недействителен.");
            return;
        }
        confirmMutation.mutate();
    }

    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", p: 3 }}>
            <Paper
                elevation={4}
                sx={{
                    p: { xs: 4, md: 5 },
                    maxWidth: 500,
                    width: "100%",
                    borderRadius: 4,
                    textAlign: "center",
                    border: "1px solid",
                    borderColor: isDeleted ? "success.light" : "divider"
                }}
            >
                {isDeleted ? (
                    <Box>
                        <Alert severity="success" sx={{ mb: 3, borderRadius: 2, textAlign: "left" }}>
                            Ваш аккаунт успешно и безвозвратно удален. Надеемся увидеть вас снова!
                        </Alert>
                        <Typography variant="body2" color="text.secondary">
                            Перенаправление на страницу входа...
                        </Typography>
                        <CircularProgress size={24} sx={{ mt: 2 }} />
                    </Box>
                ) : (
                    <Box>
                        <Box sx={{ color: "error.main", mb: 2 }}>
                            <WarningAmberIcon sx={{ fontSize: 64 }} />
                        </Box>

                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                            Подтверждение удаления аккаунта
                        </Typography>

                        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                            Вы перешли по ссылке из письма. Это действие является **окончательным**. Все ваши персональные данные, доски и проекты будут удалены без возможности восстановления.
                        </Typography>

                        {error && (
                            <Alert severity="error" sx={{ mb: 3, borderRadius: 2, textAlign: "left" }}>
                                {error}
                            </Alert>
                        )}

                        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                            <Button
                                variant="outlined"
                                onClick={() => navigate("/")}
                                disabled={confirmMutation.isPending}
                                sx={{ borderRadius: 2.5, textTransform: "none", px: 3 }}
                            >
                                Отмена
                            </Button>

                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleConfirm}
                                disabled={confirmMutation.isPending}
                                startIcon={confirmMutation.isPending ? <CircularProgress size={20} color="inherit" /> : null}
                                sx={{ borderRadius: 2.5, textTransform: "none", px: 4, fontWeight: 600 }}
                            >
                                Да, удалить мой аккаунт
                            </Button>
                        </Box>
                    </Box>
                )}
            </Paper>
        </Box>
    );
}

export default ConfirmDeletePage;