import {
    Box,
    Button,
    Typography,
} from "@mui/material";

import {
    useNavigate
} from "react-router-dom";

import CompanyCard
    from "@/components/company/CompanyCard.tsx";

import {
    useCompany
} from "@/context/CompanyContext.tsx";

function CompaniesPage() {

    const navigate =
        useNavigate();

    const { companies } =
        useCompany();

    return (
        <Box
            sx={{
                p: 5,
            }}
        >

            <Box
                sx={{
                    display: "flex",
                    justifyContent:
                        "space-between",
                    alignItems: "center",
                    mb: 5,
                }}
            >

                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: 700,
                    }}
                >
                    Мои компании
                </Typography>

                <Button
                    variant="contained"
                    size="large"
                    onClick={() =>
                        navigate(
                            "/companies/create"
                        )
                    }
                    sx={{
                        borderRadius: 3,
                        textTransform:
                            "none",
                        px: 4,
                    }}
                >
                    Создать компанию
                </Button>

            </Box>

            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 4,
                }}
            >

                {companies.map(company => (

                    <CompanyCard
                        key={company.id}
                        company={company}
                    />

                ))}

            </Box>

        </Box>
    );
}

export default CompaniesPage;