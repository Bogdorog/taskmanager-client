import { Box, Button, Container, Paper, Typography, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import BusinessIcon from "@mui/icons-material/Business"; // Из @mui/icons-material
import DashboardIcon from "@mui/icons-material/Dashboard";
import SecurityIcon from "@mui/icons-material/Security";

function HomePage() {
    // Общие стили для кнопок, чтобы не дублировать код
    const buttonStyles = {
        px: { xs: 4, sm: 5 },
        py: 1.5,
        fontSize: "1.1rem",
        textTransform: "none",
        borderRadius: 3,
    };

    return (
        <Box
            sx={{
                minHeight: "calc(100vh - 64px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                py: { xs: 4, md: 8 }, // Добавили py, чтобы контент не прилипал на мелких экранах при переполнении
                px: 2,
                bgcolor: "background.default",
            }}
        >
            <Container maxWidth="md">
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 4, sm: 6, md: 8 },
                        borderRadius: { xs: 4, md: 6 },
                        textAlign: "center",
                        background: "linear-gradient(180deg, #F8FCF8 0%, #EEF8F0 100%)",
                        border: "1px solid",
                        borderColor: "rgba(53, 91, 61, 0.1)",
                    }}
                >
                    <Typography
                        variant="h2"
                        component="h1"
                        sx={{
                            fontWeight: 800,
                            mb: 2,
                            color: "#355B3D",
                            fontSize: { xs: "2.5rem", sm: "3.5rem" },
                        }}
                    >
                        Task Manager
                    </Typography>

                    <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{
                            maxWidth: 700,
                            mx: "auto",
                            mb: 5,
                            lineHeight: 1.6,
                            fontSize: { xs: "1rem", sm: "1.15rem" },
                        }}
                    >
                        Система управления задачами и проектами для компаний. Организовывайте
                        рабочие пространства, распределяйте роли, управляйте задачами на
                        канбан-досках и контролируйте дедлайны в единой экосистеме.
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 2,
                            flexWrap: "wrap",
                            mb: 8,
                        }}
                    >
                        <Button
                            component={Link}
                            to="/login"
                            variant="contained"
                            size="large"
                            sx={buttonStyles}
                        >
                            Войти
                        </Button>

                        <Button
                            component={Link}
                            to="/register"
                            variant="outlined"
                            size="large"
                            sx={buttonStyles}
                        >
                            Регистрация
                        </Button>
                    </Box>

                    {/* Заголовок теперь семантически правильный и находится НАД сеткой фичей */}
                    <Typography
                        variant="h5"
                        component="h2"
                        sx={{
                            fontWeight: 700,
                            mb: 4,
                            color: "text.primary",
                            letterSpacing: "0.5px",
                        }}
                    >
                        Возможности платформы
                    </Typography>

                    {/* Используем полноценный MUI Grid для гарантированной адаптивности */}
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    height: "100%",
                                    borderRadius: 4,
                                    bgcolor: "background.paper",
                                    border: "1px solid",
                                    borderColor: "divider",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}
                            >
                                <BusinessIcon sx={{ fontSize: 40, color: "#355B3D", mb: 1.5 }} />
                                <Typography variant="h6" sx={{ fontWeight: 600 }} gutterBottom>
                                    Компании
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Создание изолированных компаний и удобное управление составом участников.
                                </Typography>
                            </Paper>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    height: "100%",
                                    borderRadius: 4,
                                    bgcolor: "background.paper",
                                    border: "1px solid",
                                    borderColor: "divider",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}
                            >
                                <DashboardIcon sx={{ fontSize: 40, color: "#355B3D", mb: 1.5 }} />
                                <Typography variant="h6" sx={{ fontWeight: 600 }} gutterBottom>
                                    Канбан-доски
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Визуальное распределение задач по этапам, колонкам и спринтам.
                                </Typography>
                            </Paper>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    height: "100%",
                                    borderRadius: 4,
                                    bgcolor: "background.paper",
                                    border: "1px solid",
                                    borderColor: "divider",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}
                            >
                                <SecurityIcon sx={{ fontSize: 40, color: "#355B3D", mb: 1.5 }} />
                                <Typography variant="h6" sx={{ fontWeight: 600 }} gutterBottom>
                                    Роли и права
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Гибкая настройка уровней доступа для защиты важной информации.
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </Box>
    );
}

export default HomePage;