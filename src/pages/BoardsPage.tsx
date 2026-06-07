import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Card, Typography, Grid, CircularProgress, Alert, CardActionArea, Stack, Paper } from "@mui/material";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import { useCompany } from "@/hooks/useCompany";
import type { BoardDto } from "@/types/board";
import { getBoards } from "@/api/boardApi";
import { getApiErrorMessage } from "@/utils/apiError";

import CreateBoardDialog from "@/components/board/CreateBoardDialog";
import BackButton from "@/components/utils/BackButton.tsx";

function BoardsPage() {
    const navigate = useNavigate();
    const { selectedCompany } = useCompany();

    const [boards, setBoards] = useState<BoardDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [createOpen, setCreateOpen] = useState(false);

    const loadBoards = useCallback(async () => {
        if (!selectedCompany?.id) return;
        try {
            setError("");
            const data = await getBoards(selectedCompany.id);
            setBoards(data);
        } catch (err: unknown) {
            setError(getApiErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }, [selectedCompany?.id]);

    useEffect(() => {
        if (selectedCompany?.id) {
            void loadBoards();
        }
    }, [selectedCompany, loadBoards]);

    const handleCreateBoard = async () => {
        setLoading(true);
        await loadBoards();
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 3, md: 5 }, bgcolor: "background.default", minHeight: "100vh" }}>
            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{
                    mb: 4,
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", sm: "center" }
                }}
            >
                <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                    <BackButton />
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: "text.primary" }}>
                        Доски компании
                    </Typography>
                </Stack>

                <Button
                    variant="contained"
                    startIcon={<DashboardCustomizeIcon />}
                    onClick={() => setCreateOpen(true)}
                    sx={{ borderRadius: 2.5, textTransform: "none", px: 3, height: 40 }}
                >
                    Создать доску
                </Button>
            </Stack>

            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

            {boards.length === 0 ? (
                <Paper elevation={0} sx={{ p: 6, textAlign: "center", borderRadius: 4, border: "1px dashed", borderColor: "divider", bgcolor: "rgba(0,0,0,0.01)" }}>
                    <ViewKanbanIcon sx={{ fontSize: 60, color: "text.disabled", mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>Доски отсутствуют</Typography>
                    <Typography color="text.secondary" variant="body2" sx={{ mb: 3 }}>Создайте первую канбан-доску, чтобы начать управлять задачами вашей команды.</Typography>
                    <Button variant="outlined" startIcon={<DashboardCustomizeIcon />} onClick={() => setCreateOpen(true)} sx={{ textTransform: "none", borderRadius: 2 }}>
                        Создать доску
                    </Button>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {boards.map((board) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={board.id}>
                            <Card
                                elevation={0}
                                sx={{
                                    borderRadius: 3.5,
                                    border: "1px solid",
                                    borderColor: "divider",
                                    transition: "all 0.2s ease-in-out",
                                    "&:hover": {
                                        borderColor: "primary.main",
                                        transform: "translateY(-4px)",
                                        boxShadow: "0 10px 24px rgba(0,0,0,0.05)"
                                    },
                                }}
                            >
                                <CardActionArea
                                    onClick={() => navigate(`/companies/${selectedCompany?.id}/boards/${board.id}`)}
                                    sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "space-between" }}
                                >
                                    <Box sx={{ width: "100%" }}>
                                        <Stack direction="row" spacing={1} sx={{ mb: 1.5, alignItems: "center" }}>
                                            <ViewKanbanIcon color="primary" sx={{ fontSize: 20 }} />
                                            <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                {board.name}
                                            </Typography>
                                        </Stack>

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                display: "-webkit-box",
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden",
                                                minHeight: 60,
                                                lineHeight: 1.4
                                            }}
                                        >
                                            {board.description || "Описание проекта не заполнено."}
                                        </Typography>
                                    </Box>
                                    <Stack direction="row" spacing={0.5} sx={{ mt: 2, color: "text.disabled", alignItems: "center" }}>
                                        <InfoOutlinedIcon sx={{ fontSize: 14 }} />
                                        <Typography variant="caption" sx={{ fontWeight: 500 }}>ID: {board.id}</Typography>
                                    </Stack>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            <CreateBoardDialog
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onSubmit={handleCreateBoard}
                companyId={selectedCompany?.id}
            />
        </Box>
    );
}

export default BoardsPage;