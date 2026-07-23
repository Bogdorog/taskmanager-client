import { useState } from "react";
import { Box, AppBar, Toolbar, Typography, Button, IconButton, Badge, Popover, List, ListItem, ListItemText, Divider } from "@mui/material";
import { Link, Outlet, useNavigate } from "react-router-dom";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DoneIcon from "@mui/icons-material/Done";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useNotifications } from "@/hooks/useNotifications";

function MainLayout() {
    const navigate = useNavigate();
    const { notifications, markAsRead } = useNotifications(false);

    // Состояние для управления поп-апом уведомлений
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleOpenPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClosePopover = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const unreadCount = notifications.filter(n => !n.read).length;

    // Показываем в превью только 5 последних уведомлений
    const recentNotifications = notifications.slice(0, 5);

    return (
        <Box sx={{ width: "100%", minHeight: "100vh" }}>
            <AppBar position="static" sx={{ width: "100%", boxShadow: "none" }}>
                <Toolbar disableGutters sx={{ px: 3, display: "flex", gap: 2, width: "100%", minHeight: 56 }}>
                    <Typography variant="h4" component="h1" sx={{ flexGrow: 1, fontWeight: 700 }}>
                        Task Manager
                    </Typography>

                    <Button color="inherit" component={Link} to="/companies">
                        <Typography variant="h6">Компании</Typography>
                    </Button>

                    <Button color="inherit" component={Link} to="/profile">
                        <Typography variant="h6">Профиль</Typography>
                    </Button>

                    {/* Кнопка колокольчика уведомлений */}
                    <IconButton color="inherit" onClick={handleOpenPopover}>
                        <Badge badgeContent={unreadCount} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>

                    {/*Окно с недавними уведомлениями */}
                    <Popover
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClosePopover}
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        transformOrigin={{ vertical: "top", horizontal: "right" }}
                        PaperProps={{ sx: { width: 340, maxWidth: "100%", borderRadius: 3, mt: 1.5 } }}
                    >
                        <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "grey.50" }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Недавние уведомления</Typography>
                            {unreadCount > 0 && <Typography variant="caption" color="text.secondary">{unreadCount} новых</Typography>}
                        </Box>
                        <Divider />

                        {recentNotifications.length === 0 ? (
                            <Box sx={{ p: 3, textAlign: "center" }}>
                                <Typography variant="body2" color="text.disabled" sx={{ fontStyle: "italic" }}>Уведомлений нет</Typography>
                            </Box>
                        ) : (
                            <List sx={{ p: 0, maxHeight: 300, overflowY: "auto" }}>
                                {recentNotifications.map((notif) => (
                                    <Box key={notif.id}>
                                        <ListItem
                                            sx={{
                                                bgcolor: notif.read ? "transparent" : "rgba(53, 91, 61, 0.03)",
                                                py: 1,
                                                alignItems: "flex-start"
                                            }}
                                            secondaryAction={
                                                !notif.read && (
                                                    <IconButton size="small" color="primary" onClick={() => markAsRead(notif.id)}>
                                                        <DoneIcon fontSize="small" />
                                                    </IconButton>
                                                )
                                            }
                                        >
                                            <ListItemText
                                                primary={<Typography variant="body2" sx={{ fontWeight: notif.read ? 400 : 700, pr: 3 }}>{typeof notif.payload === "string" ? notif.payload : JSON.stringify(notif.payload)}</Typography>}
                                                secondary={<Typography variant="caption" color="text.disabled">{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Typography>}
                                            />
                                        </ListItem>
                                        <Divider />
                                    </Box>
                                ))}
                            </List>
                        )}

                        {/* Кнопка перехода на полноценную страницу */}
                        <Box sx={{ p: 1, textAlign: "center", bgcolor: "grey.50" }}>
                            <Button
                                fullWidth
                                size="small"
                                startIcon={<OpenInNewIcon />}
                                onClick={() => {
                                    handleClosePopover();
                                    navigate("/notifications");
                                }}
                                sx={{ textTransform: "none" }}
                            >
                                Все уведомления
                            </Button>
                        </Box>
                    </Popover>
                </Toolbar>
            </AppBar>

            <Outlet />
        </Box>
    );
}

export default MainLayout;