import { useState } from "react";
import { Box, Paper, Typography, List, ListItem, ListItemText, Divider, TextField, Button, Stack, Alert, CircularProgress } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import DoneIcon from "@mui/icons-material/Done";
import SaveIcon from "@mui/icons-material/Save";
import { useNotifications } from "@/hooks/useNotifications";
import { updateNotificationRetention } from "@/api/notificationApi";
import { getApiErrorMessage } from "@/utils/apiError";
import BackButton from "@/components/utils/BackButton";
import {formatNotificationText, parseNotificationDate} from "@/utils/notificationUtils.ts";

function NotificationsPage() {
    const { notifications, isLoading, error, markAsRead } = useNotifications(false);

    // Состояния для формы хранения
    const [retentionDays, setRetentionDays] = useState<number>(30);
    const [settingsError, setSettingsError] = useState("");
    const [settingsSuccess, setSettingsSuccess] = useState("");

    // Мутация обновления настроек хранения на сервере
    const retentionMutation = useMutation({
        mutationFn: updateNotificationRetention,
        onSuccess: () => {
            setSettingsSuccess("Настройки хранения успешно обновлены");
            setSettingsError("");
            setTimeout(() => setSettingsSuccess(""), 3000);
        },
        onError: (err) => {
            setSettingsError(getApiErrorMessage(err));
            setSettingsSuccess("");
        }
    });

    const handleSaveRetention = () => {
        if (retentionDays < 1 || retentionDays > 365 || isNaN(retentionDays)) {
            setSettingsError("Срок хранения должен быть от 1 до 365 дней");
            return;
        }
        retentionMutation.mutate(retentionDays);
    };

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 3, md: 5 }, bgcolor: "background.default", minHeight: "100vh" }}>
            <Stack direction="row" spacing={2} sx={{ alignItems: "center", mb: 4 }}>
                <BackButton />
                <Typography variant="h4" sx={{ fontWeight: 800 }}>Центр уведомлений</Typography>
            </Stack>

            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{getApiErrorMessage(error)}</Alert>}

            <Stack direction={{ xs: "column", md: "row" }} spacing={4} sx={{ alignItems: "flex-start" }}>

                {/* Основной список уведомлений */}
                <Paper elevation={0} sx={{ xs: 12, md: 8, flexGrow: 1, width: "100%", borderRadius: 4, border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
                    <Box sx={{ p: 2.5, bgcolor: "grey.50" }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>Журнал событий</Typography>
                    </Box>
                    <Divider />

                    {notifications.length === 0 ? (
                        <Box sx={{ p: 6, textAlign: "center" }}>
                            <Typography variant="body1" color="text.secondary" sx={{ fontStyle: "italic" }}>
                                У вас нет активных или просроченных уведомлений.
                            </Typography>
                        </Box>
                    ) : (
                        <List sx={{ p: 0 }}>
                            {notifications.map((notif) => (
                                <Box key={notif.id}>
                                    <ListItem
                                        sx={{
                                            bgcolor: notif.read ? "transparent" : "rgba(53, 91, 61, 0.04)",
                                            p: 3,
                                            alignItems: "flex-start",
                                            transition: "background-color 0.2s"
                                        }}
                                        secondaryAction={
                                            !notif.read && (
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    startIcon={<DoneIcon />}
                                                    onClick={() => markAsRead(notif.id)}
                                                    sx={{ textTransform: "none", borderRadius: 1.5 }}
                                                >
                                                    Прочитано
                                                </Button>
                                            )
                                        }
                                    >
                                        <ListItemText
                                            primary={
                                                <Typography variant="body2" sx={{ fontWeight: notif.read ? 400 : 700 }}>
                                                    {formatNotificationText(notif.type, notif.payload)}
                                                </Typography>
                                            }
                                            secondary={
                                                <Typography variant="caption" color="text.disabled">
                                                    {parseNotificationDate(notif.createdAt).toLocaleString([], {
                                                        dateStyle: "short",
                                                        timeStyle: "short"
                                                    })}
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                    <Divider />
                                </Box>
                            ))}
                        </List>
                    )}
                </Paper>

                {/* Настройки хранения (Retention) */}
                <Paper sx={{ width: { xs: "100%", md: 320 }, p: 3, borderRadius: 4, border: "1px solid", borderColor: "divider" }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Настройки очистки</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Укажите, через сколько дней сервер должен автоматически стирать ваши уведомления из базы данных.
                    </Typography>

                    {settingsSuccess && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>{settingsSuccess}</Alert>}
                    {settingsError && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{settingsError}</Alert>}

                    <Stack spacing={2}>
                        <TextField
                            fullWidth
                            type="number"
                            label="Срок хранения (в днях)"
                            value={retentionDays}
                            onChange={(e) => setRetentionDays(Number(e.target.value))}
                            slotProps={{ htmlInput: { min: 1, max: 365 } }}
                            disabled={retentionMutation.isPending}
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            startIcon={retentionMutation.isPending ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                            onClick={handleSaveRetention}
                            disabled={retentionMutation.isPending}
                            sx={{ textTransform: "none", borderRadius: 2, fontWeight: 600 }}
                        >
                            Сохранить настройки
                        </Button>
                    </Stack>
                </Paper>
            </Stack>
        </Box>
    );
}

export default NotificationsPage;