import {
    Box,
    Button,
    Paper,
    Typography,
} from "@mui/material";

import {
    useNavigate
} from "react-router-dom";

function QuickActions() {

    const navigate =
        useNavigate();

    return (
        <Paper
            elevation={3}
            sx={{
                p: 4,
                borderRadius: 5,
            }}
        >

            <Typography
                variant="h5"
                sx={{
                    fontWeight: 700,
                    mb: 3,
                }}
            >
                Быстрые действия
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    gap: 2,
                    flexWrap: "wrap",
                }}
            >

                <Button
                    variant="contained"
                    onClick={() =>
                        navigate("/boards")
                    }
                >
                    Доски
                </Button>

                <Button
                    variant="outlined"
                    onClick={() =>
                        navigate("/companies")
                    }
                >
                    Компании
                </Button>

                <Button
                    variant="outlined"
                    onClick={() =>
                        navigate("/profile")
                    }
                >
                    Профиль
                </Button>

            </Box>

        </Paper>
    );
}

export default QuickActions;