import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Box, Button, Typography, CircularProgress, Alert } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

import { getCompanyMembers, getCompanyRoles, getMyPermissions } from "@/api/companyApi";
import type { CompanyMembershipDto, CompanyRoleDto } from "@/types/company";
import type { CompanyPermissions } from "@/types/company-permissions";

import CompanyMembers from "@/components/company/CompanyMembers";
import InviteMemberDialog from "@/components/company/InviteMemberDialog";
import BackButton from "@/components/utils/BackButton.tsx";
import {getApiErrorMessage} from "@/utils/apiError.ts";

function CompanyMembersPage() {
    const { id } = useParams<{ id: string }>();
    const companyId = Number(id);
    const [members, setMembers] = useState<CompanyMembershipDto[]>([]);
    const [roles, setRoles] = useState<CompanyRoleDto[]>([]);
    const [permissions, setPermissions] = useState<CompanyPermissions | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [inviteOpen, setInviteOpen] = useState(false);
    const loadData = useCallback(async () => {
        if (!id || isNaN(companyId)) return;

        try {
            setError("");
            const perms = await getMyPermissions(companyId);
            setPermissions(perms);

            if (perms.canViewMembers) {
                const [membersData, rolesData] = await Promise.all([
                    getCompanyMembers(companyId),
                    getCompanyRoles(companyId),
                ]);
                setMembers(membersData);
                setRoles(rolesData);
            }
        } catch (err: unknown) {
            setError("Не удалось загрузить данные сотрудников компании.");
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

    if (!permissions || !permissions.canViewMembers) {
        return (
            <Box sx={{ p: 5 }}>
                <Alert severity="warning" sx={{ borderRadius: 2 }}>У вас нет прав для просмотра сотрудников.</Alert>
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

            <CompanyMembers members={members} />

            <InviteMemberDialog
                open={inviteOpen}
                onClose={() => setInviteOpen(false)}
                onSuccess={loadData}
                companyId={companyId}
                roles={roles}
            />
        </Box>
    );
}

export default CompanyMembersPage;