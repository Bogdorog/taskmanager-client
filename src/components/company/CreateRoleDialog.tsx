import { useState } from "react";
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Grid, TextField, Alert, CircularProgress, Typography, Box } from "@mui/material";

import { COMPANY_PERMISSIONS } from "@/types/company-permissions.ts";
import { createRole } from "@/api/companyApi.ts";
import { PERMISSION_TRANSLATIONS } from "@/utils/permissionTranslator";
import { getApiErrorMessage } from "@/utils/apiError";

interface Props {
    open: boolean;
    onClose: () => void;
    companyId: number;
    onSuccess: () => Promise<void>;
}

function CreateRoleDialog({ open, onClose, companyId, onSuccess }: Props) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [permissions, setPermissions] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleTogglePermission = (permission: string) => {
        setPermissions((prev) =>
            prev.includes(permission)
                ? prev.filter((p) => p !== permission)
                : [...prev, permission]
        );
    };

    const handleCancel = () => {
        setName("");
        setDescription("");
        setPermissions([]);
        setError("");
        onClose();
    };

    async function handleSubmit() {
        if (!name.trim()) {
            setError("Укажите название роли");
            return;
        }

        try {
            setLoading(true);
            setError("");

            await createRole(companyId, {
                companyId,
                name: name.trim(),
                description: description.trim(),
                permissions,
            });

            await onSuccess();
            handleCancel();
        } catch (err: unknown) {
            setError(getApiErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onClose={handleCancel} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
            <DialogTitle sx={{ fontWeight: 700 }}>Создание новой роли</DialogTitle>

            <DialogContent dividers>
                {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

                <Grid container spacing={2.5}>
                    <Grid size={12}>
                        <TextField
                            fullWidth
                            required
                            label="Название роли"
                            placeholder="Например: Менеджер проектов, Бухгалтер"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={loading}
                        />
                    </Grid>

                    <Grid size={12}>
                        <TextField
                            fullWidth
                            label="Описание роли"
                            placeholder="Опишите, какие функции выполняет сотрудник с этой ролью"
                            multiline
                            rows={2}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={loading}
                        />
                    </Grid>

                    <Grid size={12}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.secondary", mt: 1, mb: 1, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                            Матрица прав доступа
                        </Typography>

                        <Grid container spacing={2}>
                            {COMPANY_PERMISSIONS.map((permission) => {
                                const meta = PERMISSION_TRANSLATIONS[permission] || { label: permission, desc: "Дополнительное системное разрешение" };
                                return (
                                    <Grid size={{ xs: 12, sm: 6 }} key={permission}>
                                        <Box
                                            sx={{
                                                p: 1.5,
                                                border: "1px solid",
                                                borderColor: permissions.includes(permission) ? "primary.light" : "divider",
                                                borderRadius: 2,
                                                bgcolor: permissions.includes(permission) ? "rgba(53, 91, 61, 0.02)" : "transparent",
                                                transition: "all 0.2s"
                                            }}
                                        >
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={permissions.includes(permission)}
                                                        onChange={() => handleTogglePermission(permission)}
                                                        disabled={loading}
                                                    />
                                                }
                                                label={
                                                    <Box>
                                                        <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
                                                            {meta.label}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary" sx={{ display: "block", lineHeight: 1.2 }}>
                                                            {meta.desc}
                                                        </Typography>
                                                    </Box>
                                                }
                                                sx={{ alignItems: "flex-start", m: 0, '& .MuiCheckbox-root': { pt: 0.2 } }}
                                            />
                                        </Box>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2.5 }}>
                <Button onClick={handleCancel} disabled={loading} sx={{ textTransform: "none", borderRadius: 2 }}>
                    Отмена
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading || !name.trim()}
                    sx={{ textTransform: "none", borderRadius: 2, minWidth: 100, height: 38 }}
                >
                    {loading ? <CircularProgress size={22} color="inherit" /> : "Создать роль"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default CreateRoleDialog;