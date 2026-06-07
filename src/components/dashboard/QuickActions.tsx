import {
    Box,
    Button,
    Paper,
    Typography,
} from "@mui/material";

import {useNavigate} from "react-router-dom";
import {useCompany} from "@/hooks/useCompany";

function QuickActions() {

    const navigate =
        useNavigate();

    const {
        selectedCompany
    } = useCompany();

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
                    disabled={!selectedCompany}
                    onClick={() => {

                        if (!selectedCompany) {
                            return;
                        }

                        navigate(
                            `/companies/${selectedCompany.id}/boards`
                        );
                    }}
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