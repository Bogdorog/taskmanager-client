import {
    Box,
    Button,
    Paper,
    Typography,
} from "@mui/material";

import type {
    CompanyDto
} from "@/types/company";

import {
    useNavigate
} from "react-router-dom";

function CompanyCard({
                         company,
                     }: {
    company: CompanyDto;
}) {

    const navigate =
        useNavigate();

    return (
        <Paper
            elevation={3}
            sx={{
                p: 4,
                borderRadius: 5,
                width: 350,
                transition:
                    "0.2s ease",
                cursor: "pointer",

                "&:hover": {
                    transform:
                        "translateY(-4px)",
                    boxShadow: 8,
                },
            }}
        >

            <Typography
                variant="h5"
                sx={{
                    fontWeight: 700,
                    mb: 1,
                }}
            >
                {company.name}
            </Typography>

            <Typography
                color="text.secondary"
                sx={{
                    minHeight: 48,
                    mb: 3,
                }}
            >
                {company.description}
            </Typography>

            <Box>

                <Typography
                    variant="body2"
                >
                    {company.email}
                </Typography>

                <Typography
                    variant="body2"
                >
                    {company.phone}
                </Typography>

            </Box>

            <Button
                fullWidth
                variant="contained"
                sx={{
                    mt: 4,
                    borderRadius: 3,
                    py: 1.2,
                    textTransform: "none",
                    fontWeight: 600,
                }}
                onClick={() =>
                    navigate(
                        `/companies/${company.id}`
                    )
                }
            >
                Открыть компанию
            </Button>

        </Paper>
    );
}

export default CompanyCard;