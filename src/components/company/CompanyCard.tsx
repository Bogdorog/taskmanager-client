import { Box, Button, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BusinessIcon from "@mui/icons-material/Business";
import type { CompanyDto } from "@/types/company";

function CompanyCard({ company }: { company: CompanyDto }) {
    const navigate = useNavigate();
    const handleOpen = () => navigate(`/companies/${company.id}`);

    return (
        <Paper
            elevation={2}
            onClick={handleOpen}
            sx={{
                p: 4,
                borderRadius: 4,
                width: "100%", // Теперь карточка резиновая и слушается Grid родителя
                minHeight: 220,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "all 0.2s ease-in-out",
                cursor: "pointer",
                border: "1px solid",
                borderColor: "divider",
                "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 24px rgba(53, 91, 61, 0.12)",
                    borderColor: "primary.light",
                },
            }}
        >
            <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                    <BusinessIcon sx={{ color: "primary.main" }} />
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 700,
                            wordBreak: "break-word",
                            lineHeight: 1.2,
                        }}
                    >
                        {company.name}
                    </Typography>
                </Box>

                <Typography
                    color="text.secondary"
                    variant="body2"
                    sx={{
                        minHeight: 40,
                        mb: 3,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden", // Защита от слишком длинного описания
                    }}
                >
                    {company.description || "Описание отсутствует"}
                </Typography>
            </Box>

            <Box>
                <Box sx={{ mb: 2, fontSize: "0.85rem", color: "text.secondary" }}>
                    {company.email && <Typography variant="caption" sx={{display: "block"}}>{company.email}</Typography>}
                    {company.phone && <Typography variant="caption" sx={{display: "block"}}>{company.phone}</Typography>}
                </Box>

                <Button
                    fullWidth
                    variant="outlined"
                    sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        pointerEvents: "none", // Кнопка кликабельна сквозь Paper
                    }}
                >
                    Открыть компанию
                </Button>
            </Box>
        </Paper>
    );
}

export default CompanyCard;