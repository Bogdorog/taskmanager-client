import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Box, Button, Chip, Paper, Stack, Typography, CircularProgress, Alert } from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";
import AddIcon from "@mui/icons-material/Add";
import { getCompanyRoles, getMyPermissions } from "@/api/companyApi";
import type { CompanyRoleDto } from "@/types/company";
import type { CompanyPermissions } from "@/types/company-permissions";
import { translatePermission } from "@/utils/permissionTranslator";
import CreateRoleDialog from "@/components/company/CreateRoleDialog";
import BackButton from "@/components/utils/BackButton.tsx";
import {getApiErrorMessage} from "@/utils/apiError.ts";

function CompanyRolesPage() {
    const { id } = useParams<{ id: string }>();
    const companyId = Number(id);

    const [roles, setRoles] = useState<CompanyRoleDto[]>([]);
    const [permissions, setPermissions] = useState<CompanyPermissions | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [createOpen, setCreateOpen] = useState(false);

    const OWNER = "OWNER";

    const loadData = useCallback(async () => {
        if (!id || isNaN(companyId)) return;
        try {
            setError("");
            const perms = await getMyPermissions(companyId);
            setPermissions(perms);

            if (perms.canViewRoles) {
                const data = await getCompanyRoles(companyId);
                setRoles(data);
            }
        } catch (err) {
            setError("Не удалось загрузить роли компании.");
            setError(getApiErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }, [id, companyId]);

    useEffect(() => {
        void loadData();
    }, [loadData]);

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 5 }}><Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert></Box>
        );
    }

    if (!permissions || !permissions.canViewRoles) {
        return (
            <Box sx={{ p: 5 }}>
                <Alert severity="warning" sx={{ borderRadius: 2 }}>У вас нет прав для просмотра ролей.</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 3, md: 5 }, bgcolor: "background.default", minHeight: "100vh" }}>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2, mb: 4 }}>
                <BackButton />
                <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
                    Роли компании
                </Typography>

                {permissions.canManageRoles && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setCreateOpen(true)}
                        sx={{ borderRadius: 2.5, textTransform: "none", px: 3 }}
                    >
                        Создать роль
                    </Button>
                )}
            </Box>

            <Stack spacing={3}>
                {roles.map((role) => (
                    <Paper
                        key={role.id}
                        elevation={2}
                        sx={{
                            p: 4,
                            borderRadius: 4,
                            border: "1px solid",
                            borderColor: "divider",
                            position: "relative",
                            overflow: "hidden"
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                            <SecurityIcon color="primary" sx={{ fontSize: 22 }} />
                            {role.name == OWNER ? (
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    ВЛАДЕЛЕЦ КОМПАНИИ
                                </Typography>
                            ) : (
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    {role.name}
                                </Typography>
                            )}

                        </Box>

                        <Typography color="text.secondary" variant="body2" sx={{ mb: 3, maxWidth: 700 }}>
                            {role.description || "Описание для роли отсутствует."}
                        </Typography>

                        <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 1.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                            Разрешенные действия:
                        </Typography>

                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ gap: 1 }}>
                            {role.permissions.length === 0 && role.name !== OWNER ? (
                                <Typography variant="body2" color="text.disabled" sx={{ fontStyle: "italic" }}>
                                    Нет назначенных прав (Пустая роль)
                                </Typography>
                            ) : (
                                role.permissions.map((permission) => (
                                    <Chip
                                        key={permission}
                                        label={translatePermission(permission)} // Переводим на русский
                                        size="small"
                                        sx={{
                                            fontWeight: 600,
                                            bgcolor: "rgba(53, 91, 61, 0.06)",
                                            color: "primary.main",
                                            borderRadius: 1.5,
                                            border: "1px solid rgba(53, 91, 61, 0.12)"
                                        }}
                                    />
                                ))
                            )}
                        </Stack>
                    </Paper>
                ))}
            </Stack>

            <CreateRoleDialog
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                companyId={companyId}
                onSuccess={loadData}
            />
        </Box>
    );
}

export default CompanyRolesPage;