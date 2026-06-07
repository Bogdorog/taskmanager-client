import { Box, Button, Typography, Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";

import CompanyCard from "@/components/company/CompanyCard.tsx";
import { useCompany } from "@/hooks/useCompany";

function CompaniesPage() {
    const navigate = useNavigate();
    const { companies } = useCompany();

    return (
        <Box
            sx={{
                p: { xs: 3, md: 5 },
                minHeight: "100vh",
                backgroundColor: "#F4F9F4",
            }}
        >
            {/* Хедер страницы */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", sm: "center" },
                    gap: 2,
                    mb: 5,
                }}
            >
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        fontWeight: 700,
                        fontSize: { xs: "1.75rem", sm: "2.25rem" },
                        color: "text.primary",
                    }}
                >
                    Мои компании
                </Typography>

                <Button
                    variant="contained"
                    size="large"
                    startIcon={<AddIcon />}
                    onClick={() => navigate("/companies/create")}
                    sx={{
                        borderRadius: 3,
                        textTransform: "none",
                        px: 4,
                        py: 1.2,
                        width: { xs: "100%", sm: "auto" },
                    }}
                >
                    Создать компанию
                </Button>
            </Box>

            {/* Логика отображения карточек / пустого стейта */}
            {companies.length === 0 ? (
                <Paper
                    elevation={0}
                    sx={{
                        p: 6,
                        textAlign: "center",
                        borderRadius: 4,
                        border: "1px dashed",
                        borderColor: "divider",
                        backgroundColor: "rgba(255,255,255,0.6)",
                        maxWidth: 500,
                        mx: "auto",
                        mt: 4,
                    }}
                >
                    <BusinessCenterOutlinedIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        У вас пока нет компаний
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 3, fontSize: "0.95rem" }}>
                        Создайте свою первую компанию, чтобы начать управлять проектами, досками и приглашать сотрудников.
                    </Typography>
                    <Button
                        variant="outlined"
                        onClick={() => navigate("/companies/create")}
                        sx={{ textTransform: "none", borderRadius: 2 }}
                    >
                        Запустить создание
                    </Button>
                </Paper>
            ) : (
                <Grid container spacing={4}>
                    {companies.map((company) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={company.id}>
                            <CompanyCard company={company} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
}

export default CompaniesPage;