import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, Paper, Typography, CircularProgress, Alert, Stack, Divider, Grid } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import PlaceIcon from "@mui/icons-material/Place";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {getCompany, getCompanyMembers, getCompanyRoles, getMyPermissions} from "@/api/companyApi";
import type {CompanyDto, CompanyMembershipDto, CompanyRoleDto} from "@/types/company";
import type { CompanyPermissions } from "@/types/company-permissions";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import TransferOwnershipDialog from "@/components/company/TransferOwnershipDialog.tsx";
import {getApiErrorMessage} from "@/utils/apiError.ts";
import BackButton from "@/components/utils/BackButton.tsx";

interface InfoRowProps {
    icon: React.ReactNode;
    label: string;
    value: string | null;
}

const InfoRow = ({ icon, label, value }: InfoRowProps) => (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, py: 1.5 }}>
        <Box sx={{ color: "primary.main", display: "flex", mt: 0.3 }}>{icon}</Box>
        <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontWeight: 500 }}>
                {label}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600, color: "text.primary" }}>
                {value || (
                    <Typography component="span" variant="body1" color="text.disabled" sx={{ fontStyle: "italic" }}>
                        Не указано
                    </Typography>
                )}
            </Typography>
        </Box>
    </Box>
);

function CompanyProfilePage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [company, setCompany] = useState<CompanyDto | null>(null);
    const [permissions, setPermissions] = useState<CompanyPermissions | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [transferOpen, setTransferOpen] = useState(false);
    const [members, setMembers] = useState<CompanyMembershipDto[]>([]);
    const [roles, setRoles] = useState<CompanyRoleDto[]>([]);

    useEffect(() => {
        let isMounted = true;

        async function load() {
            if (!id || isNaN(Number(id))) {
                setError("Некорректный идентификатор компании");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");
                const companyId = Number(id);

                const [companyData, perms] = await Promise.all([
                    getCompany(companyId),
                    getMyPermissions(companyId),
                ]);

                if (isMounted) {
                    setCompany(companyData);
                    setPermissions(perms);
                }

                if (perms.canManageCompany === true)
                {
                    const [membersData, rolesData] = await Promise.all([
                        getCompanyMembers(companyId),
                        getCompanyRoles(companyId)
                    ]);
                    setMembers(membersData);
                    setRoles(rolesData);
                }
            } catch (error) {
                if (isMounted) {
                    setError("Не удалось загрузить профиль компании.");
                    setError(getApiErrorMessage(error));
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        void load();

        return () => {
            isMounted = false;
        };
    }, [id]);

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !company || !permissions) {
        return (
            <Box sx={{ p: { xs: 3, md: 5 } }}>
                <Alert severity="error" sx={{ borderRadius: 2, mb: 3 }}>{error || "Данные недоступны"}</Alert>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(`/companies/${id}`)}>
                    Назад в компанию
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 3, md: 5 }, bgcolor: "background.default", minHeight: "100vh" }}>
            <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "flex-start", columnGap: 30, mt: 2, pt: 3, mb: 4 }}>
                <BackButton />
                <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 4, color: "text.primary" }}>
                    Профиль компании
                </Typography>
            </Box>

            <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper elevation={2} sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, border: "1px solid", borderColor: "divider" }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: "text.primary" }}>
                            Основная информация
                        </Typography>
                        <Divider sx={{ mb: 1 }} />

                        <Stack spacing={0.5}>
                            <InfoRow icon={<BusinessIcon />} label="Название организации" value={company.name} />
                            <Divider component="div" />
                            <InfoRow icon={<EmailIcon />} label="Контактный Email" value={company.email} />
                            <Divider component="div" />
                            <InfoRow icon={<PhoneIcon />} label="Номер телефона" value={company.phone} />
                            <Divider component="div" />
                            <InfoRow icon={<PlaceIcon />} label="Юридический адрес" value={company.address} />
                        </Stack>

                        {permissions.canManageCompany && (
                            <Box sx={{ mt: 4, pt: 3, borderTop: "1px solid", borderColor: "divider", display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
                                <Button
                                    variant="contained"
                                    startIcon={<EditOutlinedIcon />}
                                    onClick={() => navigate(`/companies/${company.id}/edit`)}
                                    sx={{ textTransform: "none", borderRadius: 2.5, px: 3, py: 1 }}
                                >
                                    Редактировать данные
                                </Button>

                                <Button
                                    color="warning"
                                    variant="outlined"
                                    startIcon={<SwapHorizIcon />}
                                    onClick={() => setTransferOpen(true)}
                                    sx={{ textTransform: "none", borderRadius: 2.5, px: 3, py: 1 }}
                                >
                                    Передать компанию
                                </Button>

                                <Button
                                    color="error"
                                    variant="outlined"
                                    startIcon={<DeleteOutlinedIcon />}
                                    onClick={() => navigate(`/companies/${company.id}/delete`)}
                                    sx={{ textTransform: "none", borderRadius: 2.5, px: 3, py: 1 }}
                                >
                                    Удалить компанию
                                </Button>
                            </Box>
                        )}
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 4, bgcolor: "rgba(53, 91, 61, 0.04)", border: "1px dashed", borderColor: "primary.light" }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "primary.main", mb: 1, textTransform: "uppercase" }}>
                            Ваш уровень доступа
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {permissions.canManageCompany
                                ? "Вы являетесь Администратором этой организации. Вам доступны любые изменения настроек, управление ролями, удаление компании и приглашение сотрудников."
                                : "Вы являетесь Участником организации. У вас есть доступ к назначенным канбан-доскам без прав изменения глобальных настроек компании."}
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
            <TransferOwnershipDialog
                open={transferOpen}
                onClose={() => setTransferOpen(false)}
                companyId={Number(id)}
                members={members}
                roles={roles}
            />
        </Box>
    );
}

export default CompanyProfilePage;