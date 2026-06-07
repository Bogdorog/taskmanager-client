import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Paper, Typography, TextField, Button, Alert, CircularProgress, Stack } from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import { deleteCompany } from "@/api/companyApi";
import { useCompany } from "@/hooks/useCompany";
import { getApiErrorMessage } from "@/utils/apiError";

function DeleteCompanyPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { refreshCompanies } = useCompany();

    const [confirmText, setConfirmText] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const companyId = Number(id);
    const DELETE_KEYWORD = "УДАЛИТЬ";

    const handleDelete = async () => {
        if (confirmText.toLowerCase() !== DELETE_KEYWORD.toLowerCase()) return;

        try {
            setLoading(true);
            setError("");

            await deleteCompany(companyId);
            await refreshCompanies();

            // Перенаправляем на главный список компаний
            navigate("/companies");
        } catch (error: unknown) {
            setError(getApiErrorMessage(error));
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", px: 2, bgcolor: "#FFF5F5" }}>
            <Paper elevation={4} sx={{ p: { xs: 3, sm: 5 }, maxWidth: 500, width: "100%", borderRadius: 4, textAlign: "center", border: "1px solid", borderColor: "error.light" }}>
                <Box sx={{ color: "error.main", mb: 2 }}>
                    <WarningAmberRoundedIcon sx={{ fontSize: 55 }} />
                </Box>

                <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: "error.main" }}>
                    Удаление компании
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Это действие абсолютно необратимо. Все связанные канбан-доски, задачи, настройки ролей и связи с сотрудниками будут стерты навсегда.
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2, textAlign: "left" }}>{error}</Alert>}

                <Typography variant="body2" sx={{ mb: 1.5, textAlign: "left", fontWeight: 600 }}>
                    Для подтверждения введите слово <span style={{ color: "red" }}>{DELETE_KEYWORD}</span>:
                </Typography>

                <TextField
                    fullWidth
                    size="small"
                    placeholder={DELETE_KEYWORD}
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    disabled={loading}
                    sx={{ mb: 4 }}
                />

                <Stack direction="row" spacing={2}>
                    <Button
                        fullWidth
                        variant="contained"
                        color="error"
                        size="large"
                        disabled={confirmText.toLowerCase() !== DELETE_KEYWORD.toLowerCase() || loading}
                        onClick={handleDelete}
                        sx={{ textTransform: "none", borderRadius: 2.5, height: 44, width: 600, fontWeight: 700 }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Я понимаю, удалить"}
                    </Button>

                    <Button
                        fullWidth
                        variant="outlined"
                        size="large"
                        disabled={loading}
                        onClick={() => navigate(`/companies/${companyId}/profile`)}
                        sx={{ textTransform: "none", borderRadius: 2.5, height: 44 }}
                    >
                        Отмена
                    </Button>
                </Stack>
            </Paper>
        </Box>
    );
}

export default DeleteCompanyPage;