import { useState, useEffect } from "react";
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle,
    TextField, Alert, CircularProgress, FormControlLabel, Checkbox, FormGroup, Typography, Box
} from "@mui/material";

import { updateRole } from "@/api/companyApi";
import { getApiErrorMessage } from "@/utils/apiError";
import type { CompanyRoleDto } from "@/types/company";

interface UpdateRoleDialogProps {
    open: boolean;
    onClose: () => void;
    companyId: number;
    role: CompanyRoleDto | null; // Передаем роль, которую редактируем
    allPermissions: string[]; // Список всех возможных разрешений в системе для чекбоксов
    onSuccess: () => Promise<void>;
}

function UpdateRoleDialog({ open, onClose, companyId, role, allPermissions, onSuccess }: UpdateRoleDialogProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Эффект для заполнения полей старыми данными при открытии диалога
    useEffect(() => {
        if (role) {
            setName(role.name);
            setDescription(role.description || "");
            setSelectedPermissions(role.permissions);
        }
    }, [role, open]);

    const handlePermissionChange = (permission: string, checked: boolean) => {
        if (checked) {
            setSelectedPermissions((prev) => [...prev, permission]);
        } else {
            setSelectedPermissions((prev) => prev.filter((p) => p !== permission));
        }
    };

    const handleSave = async () => {
        if (!name.trim()) {
            setError("Название роли не может быть пустым");
            return;
        }
        if (!role) return;

        try {
            setLoading(true);
            setError("");

            await updateRole(companyId, role.id, {
                companyId,
                name: name.trim(),
                description: description.trim(),
                permissions: selectedPermissions,
            });

            await onSuccess();
            onClose();
        } catch (err) {
            setError(getApiErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ fontWeight: 700 }}>Редактировать роль</DialogTitle>

            <DialogContent>
                {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

                <TextField
                    fullWidth
                    label="Название роли"
                    margin="normal"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                />

                <TextField
                    fullWidth
                    label="Описание"
                    margin="normal"
                    multiline
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={loading}
                />

                <Typography variant="subtitle2" sx={{ mt: 3, mb: 1, fontWeight: 700 }}>
                    Разрешения (Права доступа):
                </Typography>

                <Box sx={{ maxHeight: 200, overflowY: "auto", border: "1px solid", borderColor: "divider", borderRadius: 2, p: 2 }}>
                    <FormGroup>
                        {allPermissions.map((perm) => (
                            <FormControlLabel
                                key={perm}
                                control={
                                    <Checkbox
                                        checked={selectedPermissions.includes(perm)}
                                        onChange={(e) => handlePermissionChange(perm, e.target.checked)}
                                        disabled={loading}
                                    />
                                }
                                label={perm} // Здесь можно обернуть в функцию перевода, например translatePermission(perm)
                            />
                        ))}
                    </FormGroup>
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button onClick={onClose} disabled={loading} sx={{ textTransform: "none", borderRadius: 2 }}>
                    Отмена
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={loading || !name.trim()}
                    sx={{ textTransform: "none", borderRadius: 2, minWidth: 110 }}
                >
                    {loading ? <CircularProgress size={20} color="inherit" /> : "Сохранить"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default UpdateRoleDialog;