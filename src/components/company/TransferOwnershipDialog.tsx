import { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField, Alert, CircularProgress, Typography, Stack } from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

import { transferOwnership } from "@/api/companyApi.ts";
import { getApiErrorMessage } from "@/utils/apiError";
import type { CompanyMembershipDto, CompanyRoleDto } from "@/types/company.ts";

interface Props {
    open: boolean;
    onClose: () => void;
    companyId: number;
    members: CompanyMembershipDto[];
    roles: CompanyRoleDto[];
    onSuccess?: () => void; // Дополнительный коллбек, чтобы обновить права на странице после передачи
}

function TransferOwnershipDialog({ open, onClose, companyId, members, roles, onSuccess }: Props) {
    const [userId, setUserId] = useState("");
    const [roleId, setRoleId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleTransfer() {
        if (!userId || !roleId) {
            setError("Необходимо выбрать нового владельца и вашу новую роль");
            return;
        }

        try {
            setLoading(true);
            setError("");

            await transferOwnership(companyId, {
                companyId,
                newOwnerUserId: Number(userId),
                newOwnerRoleId: Number(roleId),
            });

            if (onSuccess) onSuccess();
            handleCancel();
        } catch (err: unknown) {
            setError(getApiErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    const handleCancel = () => {
        setUserId("");
        setRoleId("");
        setError("");
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleCancel} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
            <DialogTitle sx={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 1 }}>
                <SwapHorizIcon color="primary" /> Передать управление
            </DialogTitle>

            <DialogContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                    Вы передадите полные права Создателя (Владельца) другому сотруднику. Для завершения операции выберите преемника и укажите, какую роль в компании займете вы сами после передачи.
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

                <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField
                        select
                        fullWidth
                        label="Новый владелец компании"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        disabled={loading}
                    >
                        {members.map((member) => (
                            <MenuItem key={member.user.id} value={member.user.id}>
                                {member.user.fullName} ({member.role.name})
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        fullWidth
                        label="Ваша новая роль в компании"
                        value={roleId}
                        onChange={(e) => setRoleId(e.target.value)}
                        disabled={loading}
                    >
                        {roles.map((role) => (
                            <MenuItem key={role.id} value={role.id}>
                                {role.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button onClick={handleCancel} disabled={loading} sx={{ textTransform: "none", borderRadius: 2 }}>
                    Отмена
                </Button>

                <Button
                    color="warning"
                    variant="contained"
                    onClick={handleTransfer}
                    disabled={loading || !userId || !roleId}
                    sx={{ textTransform: "none", borderRadius: 2, minWidth: 110 }}
                >
                    {loading ? <CircularProgress size={20} color="inherit" /> : "Передать права"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default TransferOwnershipDialog;