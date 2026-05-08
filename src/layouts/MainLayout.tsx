import { AppBar, Toolbar, Typography, Container } from "@mui/material";
import { Outlet } from "react-router-dom";

function MainLayout() {
    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">
                        Conscious Citizen
                    </Typography>
                </Toolbar>
            </AppBar>

            <Container sx={{ mt: 4 }}>
                <Outlet />
            </Container>
        </>
    );
}

export default MainLayout;