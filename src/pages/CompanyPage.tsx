import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, CircularProgress, Paper, Typography, Alert, Grid, Card, CardActionArea, Stack } from "@mui/material";
import { Divider } from "@mui/material";
import LeaveCompanyDialog from "@/components/company/LeaveCompanyDialog.tsx";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ViewKanbanOutlinedIcon from "@mui/icons-material/ViewKanbanOutlined";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import AddIcon from "@mui/icons-material/Add";
import { useCompanyData } from "@/hooks/useCompanyData";
import CompanyHeader from "@/components/company/CompanyHeader";
import {useState} from "react";
import CreateBoardDialog from "@/components/board/CreateBoardDialog.tsx";

const getCompanyPath = (id: number, subPath: string = "") =>
    `/companies/${id}${subPath ? `/${subPath}` : ""}`;

function CompanyPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const companyId = Number(id);
    const [leaveOpen, setLeaveOpen] = useState(false);
    const { data, isLoading, error } = useCompanyData(companyId);
    const [createOpen, setCreateOpen] = useState(false);
    const handleCreateBoard = async () => {
    };

    if (!id || isNaN(companyId)) {
        return (
            <Box sx={{ p: { xs: 3, md: 5 } }}>
                <Alert severity="error" sx={{ borderRadius: 2 }}>Некорректный идентификатор компании</Alert>
            </Box>
        );
    }

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
                <CircularProgress color="primary" />
            </Box>
        );
    }

    if (error || !data?.company) {
        return (
            <Box sx={{ p: { xs: 3, md: 5 } }}>
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                    {error instanceof Error ? error.message : "Не удалось загрузить данные компании"}
                </Alert>
            </Box>
        );
    }

    const { company, boards } = data;
    const basePath = (sub: string) => getCompanyPath(company.id, sub);

    return (
        <Box sx={{ p: { xs: 3, md: 5 }, bgcolor: "background.default", minHeight: "100vh" }}>
            {/* Верхний блок: Информация о компании */}
            <Card elevation={0} sx={{ p: 4, borderRadius: 4, mb: 4, border: "1px solid", borderColor: "divider", background: "linear-gradient(135deg, #FFFFFF 0%, #F9FDF9 100%)" }}>
                <CompanyHeader company={company} />
            </Card>

            <Grid container spacing={4}>
                {/* Левая колонка: Навигация и инструменты управления */}
                <Grid size={{ xs: 12, md: 3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, textTransform: "uppercase", color: "text.secondary", mb: 2, letterSpacing: "0.5px" }}>
                        Управление
                    </Typography>
                    <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: "1px solid", borderColor: "divider", display: "flex", flexDirection: "column", gap: 1 }}>
                        <Button
                            fullWidth
                            variant="contained"
                            disableElevation
                            startIcon={<DashboardIcon />}
                            onClick={() => navigate(basePath("boards"))}
                            sx={{ justifyContent: "flex-start", py: 1.2, borderRadius: 2, textTransform: "none", fontWeight: 600 }}
                        >
                            Доски
                        </Button>
                        <Button
                            fullWidth
                            variant="text"
                            startIcon={<PeopleIcon />}
                            onClick={() => navigate(basePath("members"))}
                            sx={{ justifyContent: "flex-start", py: 1.2, borderRadius: 2, textTransform: "none", color: "text.primary", "&:hover": { bgcolor: "action.hover" } }}
                        >
                            Сотрудники
                        </Button>
                        <Button
                            fullWidth
                            variant="text"
                            startIcon={<AdminPanelSettingsIcon />}
                            onClick={() => navigate(basePath("roles"))}
                            sx={{ justifyContent: "flex-start", py: 1.2, borderRadius: 2, textTransform: "none", color: "text.primary", "&:hover": { bgcolor: "action.hover" } }}
                        >
                            Роли доступа
                        </Button>
                        <Button
                            fullWidth
                            variant="text"
                            startIcon={<SettingsIcon />}
                            onClick={() => navigate(basePath("profile"))}
                            sx={{ justifyContent: "flex-start", py: 1.2, borderRadius: 2, textTransform: "none", color: "text.primary", "&:hover": { bgcolor: "action.hover" } }}
                        >
                            Профиль компании
                        </Button>

                        <Divider sx={{ my: 1 }} />

                        <Button
                            fullWidth
                            variant="text"
                            color="error"
                            startIcon={<ExitToAppIcon />}
                            onClick={() => setLeaveOpen(true)}
                            sx={{ justifyContent: "flex-start", py: 1.2, borderRadius: 2, textTransform: "none", fontWeight: 500 }}
                        >
                            Покинуть компанию
                        </Button>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 9 }}>
                    <Stack direction="row" sx={{ mb: 3, justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: "text.primary", display: "flex", alignItems: "center", gap: 1, padding: 1 }}>
                            <ViewKanbanOutlinedIcon sx={{ color: "primary.main" }} /> Рабочие доски
                        </Typography>
                        {boards.length > 0 && (
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<AddIcon />}
                                onClick={() => setCreateOpen(true)}
                                sx={{ textTransform: "none", borderRadius: 2, fontWeight: 600 }}
                            >
                                Добавить доску
                            </Button>
                        )}
                    </Stack>

                    {boards.length === 0 ? (
                        <Paper
                            elevation={0}
                            sx={{ p: 6, textAlign: "center", borderRadius: 4, border: "1px dashed", borderColor: "divider", bgcolor: "rgba(255,255,255,0.4)" }}
                        >
                            <ViewKanbanOutlinedIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1.5 }} />
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>Пространство пусто</Typography>
                            <Typography color="text.secondary" variant="body2" sx={{ mb: 3 }}>В этой компании еще не создано ни одной канбан-доски.</Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => setCreateOpen(true)}
                                sx={{ textTransform: "none", borderRadius: 2 }}
                            >
                                Создать первую доску
                            </Button>
                        </Paper>
                    ) : (
                        <Grid container spacing={3}>
                            {boards.map((board) => (
                                <Grid size={{ xs: 12, sm: 6 }} key={board.id}>
                                    <Card
                                        elevation={0}
                                        sx={{
                                            borderRadius: 3,
                                            border: "1px solid",
                                            borderColor: "divider",
                                            transition: "all 0.2s ease-in-out",
                                            "&:hover": {
                                                transform: "translateY(-2px)",
                                                boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
                                                borderColor: "primary.light"
                                            }
                                        }}
                                    >
                                        <CardActionArea
                                            onClick={() => navigate(`${basePath("boards")}/${board.id}`)}
                                            sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "space-between" }}
                                        >
                                            <Box sx={{ width: "100%" }}>
                                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: "text.primary", lineHeight: 1.3 }}>
                                                    {board.name}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{
                                                        mb: 3,
                                                        display: "-webkit-box",
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: "vertical",
                                                        overflow: "hidden",
                                                        minHeight: 40
                                                    }}
                                                >
                                                    {board.description || "Без описания"}
                                                </Typography>
                                            </Box>

                                            <Stack direction="row" spacing={1} sx={{ color: "primary.main", bgcolor: "rgba(53, 91, 61, 0.06)", px: 1.5, py: 0.5, borderRadius: 2, alignItems: "center" }}>
                                                <ViewColumnIcon sx={{ fontSize: 16 }} />
                                                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                                    Колонок: {board.columns?.length || 0}
                                                </Typography>
                                            </Stack>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Grid>
            </Grid>
            <LeaveCompanyDialog
                open={leaveOpen}
                onClose={() => setLeaveOpen(false)}
                companyId={companyId}
            />
            <CreateBoardDialog
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onSubmit={handleCreateBoard}
                companyId={Number(id)}
            />
        </Box>
    );
}

export default CompanyPage;