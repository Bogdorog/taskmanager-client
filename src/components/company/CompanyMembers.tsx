import { useState } from "react";
import {
    Paper, Typography, List, Box, ListItem, ListItemAvatar, Avatar, ListItemText,
    Divider, Chip, IconButton, Tooltip, Stack
} from "@mui/material";
import BadgeIcon from "@mui/icons-material/Badge";
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from "@mui/icons-material/Edit";
import AssignRoleDialog from "./AssignRoleDialog"; // Твой диалог
import { removeCompanyMember } from "@/api/companyApi";
import { getApiErrorMessage } from "@/utils/apiError";
import type { CompanyMembershipDto, CompanyRoleDto } from "@/types/company";
import type { CompanyPermissions } from "@/types/company-permissions";

interface CompanyMembersProps {
    members: CompanyMembershipDto[];
    companyId: number;
    roles: CompanyRoleDto[];
    permissions: CompanyPermissions | null;
    onUpdate: () => Promise<void>;
}

function stringToColor(string: string) {
    let hash = 0;
    for (let i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";
    for (let i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
}

function getInitials(fullName: string) {
    return fullName.split(" ").filter(Boolean).map((word) => word[0]).slice(0, 2).join("").toUpperCase();
}

function CompanyMembers({ members, companyId, roles, permissions, onUpdate }: CompanyMembersProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedMembershipId, setSelectedMembershipId] = useState<number | null>(null);
    const [error, setError] = useState("");

    const OWNER_ROLE = "OWNER";
    // Проверка права управления членами команды
    const canManage = permissions?.canManageMembers ?? false;

    const handleOpenAssignDialog = (membershipId: number) => {
        setSelectedMembershipId(membershipId);
        setDialogOpen(true);
    };

    const handleRemoveMember = async (membershipId: number, fullName: string) => {
        if (!window.confirm(`Вы уверены, что хотите исключить (уволить) сотрудника ${fullName} из компании?`)) {
            return;
        }

        try {
            setError("");
            await removeCompanyMember(companyId, membershipId);
            await onUpdate(); // Реактивно обновляем список
        } catch (err) {
            alert(getApiErrorMessage(err));
        }
    };

    return (
        <Paper
            elevation={2}
            sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider"
            }}
        >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
                <BadgeIcon color="primary" /> Список участников ({members.length})
            </Typography>

            <List disablePadding>
                {members.map((member, index) => {
                    const isOwner = member.role.name === OWNER_ROLE;

                    return (
                        <Box key={member.id}>
                            <ListItem
                                secondaryAction={
                                    <Stack direction="row" spacing={1.5}  sx={{ alignItems: "center" }}>
                                        {/* Смена роли */}
                                        <Tooltip title={canManage && !isOwner ? "Изменить роль" : ""}>
                                            <Chip
                                                label={isOwner ? "ВЛАДЕЛЕЦ" : member.role.name}
                                                onClick={canManage && !isOwner ? () => handleOpenAssignDialog(member.id) : undefined}
                                                onDelete={canManage && !isOwner ? () => handleOpenAssignDialog(member.id) : undefined}
                                                deleteIcon={<EditIcon style={{ fontSize: 14, color: "inherit" }} />}
                                                sx={{
                                                    fontWeight: 600,
                                                    bgcolor: isOwner ? "rgba(25, 118, 210, 0.08)" : "rgba(53, 91, 61, 0.08)",
                                                    color: isOwner ? "primary.main" : "success.main",
                                                    borderRadius: 1.5,
                                                    cursor: canManage && !isOwner ? "pointer" : "default"
                                                }}
                                            />
                                        </Tooltip>

                                        {/* Иконка увольнения сотрудника */}
                                        {canManage && !isOwner && (
                                            <Tooltip title="Исключить из компании">
                                                <IconButton
                                                    color="error"
                                                    size="small"
                                                    onClick={() => handleRemoveMember(member.id, member.user.fullName)}
                                                    sx={{
                                                        border: "1px solid",
                                                        borderColor: "error.light",
                                                        borderRadius: 2,
                                                        p: 0.6
                                                    }}
                                                >
                                                    <DeleteOutlinedIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </Stack>
                                }
                                sx={{ py: 2, px: 1 }}
                            >
                                <ListItemAvatar>
                                    <Avatar
                                        sx={{
                                            width: 46,
                                            height: 46,
                                            fontSize: 16,
                                            fontWeight: 600,
                                            bgcolor: stringToColor(member.user.login),
                                            color: "#fff"
                                        }}
                                    >
                                        {getInitials(member.user.fullName)}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "text.primary" }}>
                                            {member.user.fullName}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="body2" color="text.secondary">
                                            @{member.user.login}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                            {index < members.length - 1 && <Divider component="li" />}
                        </Box>
                    );
                })}
            </List>

            {/* Диалог изменения роли */}
            {selectedMembershipId !== null && (
                <AssignRoleDialog
                    open={dialogOpen}
                    onClose={() => {
                        setDialogOpen(false);
                        setSelectedMembershipId(null);
                    }}
                    companyId={companyId}
                    membershipId={selectedMembershipId}
                    roles={roles.filter(r => r.name !== OWNER_ROLE)} // Нельзя выдать роль OWNER через диалог
                    onSuccess={onUpdate}
                />
            )}
        </Paper>
    );
}

export default CompanyMembers;