import {
    Box,
    Typography,
} from "@mui/material";

import {
    useAuth
} from "@/context/AuthContext";

import {
    useCompany
} from "@/context/CompanyContext";

function DashboardHeader() {

    const { user } =
        useAuth();

    const {
        selectedCompany
    } = useCompany();

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
                    mb: 1,
                }}
            >
                Добро пожаловать,
                {" "}
                {user?.fullName}
            </Typography>

            <Typography
                variant="h5"
                color="text.secondary"
            >
                Компания:
                {" "}
                {selectedCompany?.name}
            </Typography>

        </Box>
    );
}

export default DashboardHeader;