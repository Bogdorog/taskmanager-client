import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Box, Button, Chip, Paper, Stack, Typography, CircularProgress, Alert } from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";
import {deleteCompanyRole, getCompanyRoles, getMyPermissions} from "@/api/companyApi";
import type { CompanyRoleDto } from "@/types/company";
import type { CompanyPermissions } from "@/types/company-permissions";
import { translatePermission } from "@/utils/permissionTranslator";
import BackButton from "@/components/utils/BackButton.tsx";
import {getApiErrorMessage} from "@/utils/apiError.ts";
import EditIcon from "@mui/icons-material/Edit";
import RoleDialog from "@/components/company/RoleDialog.tsx";

function CompanyRolesPage() {
    const { id } = useParams<{ id: string }>();
    const companyId = Number(id);
    const [selectedRole, setSelectedRole] = useState<CompanyRoleDto | null>(null);
    const [roles, setRoles] = useState<CompanyRoleDto[]>([]);
    const [permissions, setPermissions] = useState<CompanyPermissions | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [roleDialogOpen, setRoleDialogOpen] = useState(false);

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
            setError(getApiErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }, [id, companyId]);

    // Функция удаления роли
    const handleDeleteRole = async (roleId: number, roleName: string) => {
        if (!window.confirm(`Вы уверены, что хотите удалить роль "${roleName}"?`)) {
            return;
        }

        try {
            setError("");
            setLoading(true); // Показываем лоадер на время удаления

            await deleteCompanyRole(companyId, roleId);

            // Перезагружаем список ролей после успешного удаления
            await loadData();
        } catch (err) {
            setError(getApiErrorMessage(err));
            setLoading(false);
        }
    };

    // Клик по кнопке "Создать роль"
    const handleCreateRole = () => {
        setSelectedRole(null);
        setRoleDialogOpen(true);
    };

    // Клик по иконке карандаша на карточке роли
    const handleEditRole = (role: CompanyRoleDto) => {
        setSelectedRole(role);
        setRoleDialogOpen(true);
    };

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
            <Box sx={{ p: 5 }}>
                <Alert severity="error" onClose={() => setError("")} sx={{ borderRadius: 2 }}>
                    {error}
                </Alert>
            </Box>
        );
    }

    if (!permissions || !permissions.canViewRoles) {
        return (
            <Box sx={{ p: 5 }}>
                <Alert severity="warning" sx={{ borderRadius: 2 }}>
                    У вас нет прав для просмотра ролей.
                </Alert>
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
                        onClick={() => handleCreateRole()}
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
                        {/* Название роли и кнопки упраления */}
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                <SecurityIcon color="primary" sx={{ fontSize: 22 }} />
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    {role.name === OWNER ? "ВЛАДЕЛЕЦ КОМПАНИИ" : role.name}
                                </Typography>
                            </Box>

                            {/* Блок кнопок управления ролями */}
                            {permissions.canManageRoles && role.name !== OWNER && (
                                <Stack direction="row" spacing={1}>
                                    {/* КНОПКА РЕДАКТИРОВАНИЯ */}
                                    <Tooltip title="Редактировать роль" arrow>
                                        <IconButton
                                            color="primary"
                                            onClick={() => handleEditRole(role)}
                                            sx={{
                                                border: "1px solid",
                                                borderColor: "primary.light",
                                                borderRadius: 2,
                                                p: 0.8,
                                                "&:hover": { bgcolor: "primary.lighter" }
                                            }}
                                        >
                                            <EditIcon sx={{ fontSize: 20 }} />
                                        </IconButton>
                                    </Tooltip>

                                    {/* КНОПКА УДАЛЕНИЯ */}
                                    <Tooltip title="Удалить роль" arrow>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDeleteRole(role.id, role.name)}
                                            sx={{
                                                border: "1px solid",
                                                borderColor: "error.light",
                                                borderRadius: 2,
                                                p: 0.8,
                                                "&:hover": { bgcolor: "error.lighter" }
                                            }}
                                        >
                                            <DeleteOutlinedIcon sx={{ fontSize: 20 }} />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            )}
                        </Box>

                        <Typography color="text.secondary" variant="body2" sx={{ mb: 3, maxWidth: 700 }}>
                            {role.description || "Описание для роли отсутствует."}
                        </Typography>

                        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                            Разрешенные действия:
                        </Typography>

                        <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap", gap: 1 }}>
                            {role.permissions.length === 0 && role.name !== OWNER ? (
                                <Typography variant="body2" color="text.disabled" sx={{ fontStyle: "italic" }}>
                                    Нет назначенных прав (Пустая роль)
                                </Typography>
                            ) : (
                                role.permissions.map((permission) => (
                                    <Chip
                                        key={permission}
                                        label={translatePermission(permission)}
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

            <RoleDialog
                open={roleDialogOpen}
                onClose={() => {
                    setRoleDialogOpen(false);
                    setSelectedRole(null);
                }}
                companyId={companyId}
                role={selectedRole}
                onSuccess={loadData}
            />
        </Box>
    );
}

export default CompanyRolesPage;