import {
    AppBar,
    Box,
    Button,
    Toolbar,
    Typography,
} from "@mui/material";

import {
    Link,
    Outlet,
} from "react-router-dom";

function MainLayout() {

    return (
        <Box
            sx={{
                width: "100%",
                minHeight: "100vh",
            }}
        >

            <AppBar
                position="static"
                sx={{
                    width: "100%",
                    boxShadow: "none",
                }}
            >

                <Toolbar
                    disableGutters
                    sx={{
                        px: 3,
                        display: "flex",
                        gap: 2,
                        width: "100%",
                        minHeight: 56,
                    }}
                >

                    <Typography
                        variant="h4"
                        component="h1"
                        sx={{
                            flexGrow: 1,
                            fontWeight: 700,
                        }}
                    >
                        Task Manager
                    </Typography>

                    <Button

                        color="inherit"
                        component={Link}
                        to="/companies"
                    >
                        <Typography
                            variant="h6"
                        >
                            Компании
                        </Typography>
                    </Button>

                    <Button
                        color="inherit"
                        component={Link}
                        to="/profile"
                    >
                        <Typography
                            variant="h6"
                        >
                            Профиль
                        </Typography>
                    </Button>

                </Toolbar>

            </AppBar>

            <Outlet />

        </Box>
    );
}

export default MainLayout;