import { Box, Typography, Chip } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import PlaceIcon from "@mui/icons-material/Place";
import type { CompanyDto } from "@/types/company";

function CompanyHeader({ company }: { company: CompanyDto }) {
    return (
        <Box sx={{ mb: 4 }}>
            <Typography
                variant="h3"
                component="h1"
                sx={{
                    fontWeight: 800,
                    fontSize: { xs: "2rem", sm: "2.75rem" },
                    mb: 1.5,
                    color: "text.primary",
                }}
            >
                {company.name}
            </Typography>

            {company.description && (
                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                        maxWidth: 800,
                        mb: 3,
                        lineHeight: 1.6,
                    }}
                >
                    {company.description}
                </Typography>
            )}

            <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                {company.email && (
                    <Chip
                        icon={<EmailIcon style={{ fontSize: 16 }} />}
                        label={company.email}
                        variant="outlined"
                        sx={{ borderRadius: 2, px: 0.5 }}
                    />
                )}

                {company.phone && (
                    <Chip
                        icon={<PhoneIcon style={{ fontSize: 16 }} />}
                        label={company.phone}
                        variant="outlined"
                        sx={{ borderRadius: 2, px: 0.5 }}
                    />
                )}

                {company.address && (
                    <Chip
                        icon={<PlaceIcon style={{ fontSize: 16 }} />}
                        label={company.address}
                        variant="outlined"
                        sx={{ borderRadius: 2, px: 0.5 }}
                    />
                )}
            </Box>
        </Box>
    );
}

export default CompanyHeader;