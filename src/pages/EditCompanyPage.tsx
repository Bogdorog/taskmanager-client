import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Alert, CircularProgress, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { getCompany, updateCompany } from "@/api/companyApi";
import CompanyFormEdit from "@/components/company/CompanyFormEdit"; // Изменим форму под поддержку дефолтных значений
import { useCompany } from "@/hooks/useCompany";
import { getApiErrorMessage } from "@/utils/apiError";
import type { CreateCompanyRequest } from "@/types/company";

function EditCompanyPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { refreshCompanies } = useCompany();

    const [initialData, setInitialData] = useState<CreateCompanyRequest | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const companyId = Number(id);

    useEffect(() => {
        async function fetchCompany() {
            try {
                const data = await getCompany(companyId);
                setInitialData({
                    name: data.name,
                    description: data.description || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    address: data.address || "",
                });
            } catch (error: unknown) {
                setError(getApiErrorMessage(error));
            } finally {
                setLoading(false);
            }
        }
        void fetchCompany();
    }, [companyId]);

    const handleSubmit = async (data: CreateCompanyRequest) => {
        try {
            setSubmitting(true);
            setError("");

            await updateCompany(companyId, data);
            await refreshCompanies();

            navigate(`/companies/${companyId}/profile`);
        } catch (error: unknown) {
            setError(getApiErrorMessage(error));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 3, md: 5 }, bgcolor: "background.default", minHeight: "100vh" }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(`/companies/${companyId}/profile`)}
                sx={{ textTransform: "none", mb: 3, color: "text.secondary" }}
            >
                Отмена и назад к профилю
            </Button>

            {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2, maxWidth: 650, mx: "auto" }}>
                    {error}
                </Alert>
            )}

            {initialData && (
                <CompanyFormEdit
                    onSubmit={handleSubmit}
                    isLoading={submitting}
                    defaultValues={initialData}
                />
            )}
        </Box>
    );
}

export default EditCompanyPage;