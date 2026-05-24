import {
    Box,
    Typography,
    Chip,
} from "@mui/material";

import type {
    CompanyDto
} from "@/types/company";

function CompanyHeader({
                           company,
                       }: {
    company: CompanyDto;
}) {

    return (
        <Box
            sx={{
                mb: 5,
            }}
        >

            <Typography
                variant="h3"
                sx={{
                    fontWeight: 700,
                    mb: 2,
                }}
            >
                {company.name}
            </Typography>

            <Typography
                variant="h6"
                color="text.secondary"
                sx={{
                    maxWidth: 900,
                    mb: 3,
                }}
            >
                {company.description}
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    gap: 2,
                    flexWrap: "wrap",
                }}
            >

                <Chip
                    label={company.email}
                />

                <Chip
                    label={company.phone}
                />

                <Chip
                    label={company.address}
                />

            </Box>

        </Box>
    );
}

export default CompanyHeader;