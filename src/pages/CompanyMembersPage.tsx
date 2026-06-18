import { useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Button, Typography, CircularProgress, Alert } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

import { useCompanyMembersData } from "@/hooks/useCompanyMembersData";
import { getApiErrorMessage } from "@/utils/apiError.ts";

import CompanyMembers from "@/components/company/CompanyMembers";
import InviteMemberDialog from "@/components/company/InviteMemberDialog";
import BackButton from "@/components/utils/BackButton.tsx";

function CompanyMembersPage() {
    const { id } = useParams<{ id: string }>();
    const companyId = Number(id);
    const [inviteOpen, setInviteOpen] = useState(false);
    const {
        permissions,
        members,
        roles,
        isLoading,
        error,
        refetchAll
    } = useCompanyMembersData(companyId);

    if (isNaN(companyId) || companyId <= 0) {
        return (
            <Box sx={{ p: 5 }}>
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                    Некорректный идентификатор компании
                </Alert>
            </Box>
        );
    }

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 5 }}>
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                    {getApiErrorMessage(error)}
                </Alert>
            </Box>
        );
    }

    // Если данные загрузились, но у пользователя нет прав на просмотр
    if (!permissions || !permissions.canViewMembers) {
        return (
            <Box sx={{ p: 5 }}>
                <Box sx={{ display: "flex", mb: 2 }}>
                    <BackButton />
                </Box>
                <Alert severity="warning" sx={{ borderRadius: 2 }}>
                    У вас нет прав для просмотра сотрудников.
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 3, md: 5 }, bgcolor: "background.default", minHeight: "100vh" }}>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2, mb: 4 }}>
                <BackButton />
                <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
                    Сотрудники
                </Typography>

                {permissions.canInviteUsers && (
                    <Button
                        variant="contained"
                        startIcon={<PersonAddIcon />}
                        onClick={() => setInviteOpen(true)}
                        sx={{ borderRadius: 2.5, textTransform: "none", px: 3 }}
                    >
                        Пригласить сотрудника
                    </Button>
                )}
            </Box>
            <CompanyMembers
                members={members}
                companyId={companyId}
                roles={roles}
                permissions={permissions}
                onUpdate={refetchAll}
            />
            <InviteMemberDialog
                open={inviteOpen}
                onClose={() => setInviteOpen(false)}
                onSuccess={refetchAll}
                companyId={companyId}
                roles={roles}
            />
        </Box>
    );
}

export default CompanyMembersPage;