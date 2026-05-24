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
        <Box>

            <AppBar position="static">

                <Toolbar
                    sx={{
                        display: "flex",
                        gap: 2,
                    }}
                >

                    <Typography
                        variant="h6"
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
                        to="/"
                    >
                        Dashboard
                    </Button>

                    <Button
                        color="inherit"
                        component={Link}
                        to="/companies"
                    >
                        Компании
                    </Button>

                    <Button
                        color="inherit"
                        component={Link}
                        to="/profile"
                    >
                        Профиль
                    </Button>

                </Toolbar>

            </AppBar>

            <Outlet />

        </Box>
    );
}

export default MainLayout;