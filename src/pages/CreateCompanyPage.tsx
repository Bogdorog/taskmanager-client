import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Alert, CircularProgress } from "@mui/material";

import { createCompany } from "@/api/companyApi.ts";
import CompanyForm from "@/components/company/CompanyForm.tsx";
import { useCompany } from "@/hooks/useCompany";
import { getApiErrorMessage } from "@/utils/apiError";
import type { CreateCompanyRequest } from "@/types/company.ts";

function CreateCompanyPage() {
    const navigate = useNavigate();
    const { refreshCompanies } = useCompany();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (data: CreateCompanyRequest) => {
        try {
            setLoading(true);
            setError("");

            const company = await createCompany(data);

            // Сначала дожидаемся обновления списка компаний в контексте
            await refreshCompanies();

            // И только потом улетаем на страницу созданной компании
            navigate(`/companies/${company.id}`);
        } catch (err: unknown) {
            setError(getApiErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ position: "relative", minHeight: "100vh", bgcolor: "background.default" }}>
            {/* Если идет глобальное обновление данных, покажем аккуратный оверлей-лоадер */}
            {loading && (
                <Box
                    sx={{
                        position: "absolute",
                        top: 0, left: 0, right: 0, bottom: 0,
                        bgcolor: "rgba(255,255,255,0.7)",
                        zIndex: 10,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <CircularProgress />
                </Box>
            )}

            {error && (
                <Box sx={{ display: "flex", justifyContent: "center", pt: 4, px: 3 }}>
                    <Alert severity="error" sx={{ width: "100%", maxWidth: 600, borderRadius: 2 }}>
                        {error}
                    </Alert>
                </Box>
            )}

            {/* Передаем состояние загрузки в форму, чтобы заблокировать там кнопки внутри */}
            <CompanyForm onSubmit={handleSubmit} isLoading={loading} />
        </Box>
    );
}

export default CreateCompanyPage;