import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Alert, CircularProgress } from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import { leaveCompany } from "@/api/companyApi.ts";
import { getApiErrorMessage } from "@/utils/apiError";

interface Props {
    open: boolean;
    onClose: () => void;
    companyId: number;
}

function LeaveCompanyDialog({ open, onClose, companyId }: Props) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleLeave() {
        try {
            setLoading(true);
            setError("");

            await leaveCompany(companyId);
            onClose();

            navigate("/companies");
        } catch (err: unknown) {
            setError(getApiErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
            <DialogTitle sx={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 1, color: "warning.main" }}>
                <WarningAmberRoundedIcon /> Покинуть компанию
            </DialogTitle>

            <DialogContent>
                {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

                <Typography variant="body2" color="text.secondary">
                    Вы уверены, что хотите выйти из состава участников этой организации? Вы потеряете доступ ко всем её рабочим пространствам, канбан-доскам и задачам.
                </Typography>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button onClick={onClose} disabled={loading} sx={{ textTransform: "none", borderRadius: 2 }}>
                    Отмена
                </Button>

                <Button
                    color="warning"
                    variant="contained"
                    onClick={handleLeave}
                    disabled={loading}
                    sx={{ textTransform: "none", borderRadius: 2, minWidth: 100 }}
                >
                    {loading ? <CircularProgress size={20} color="inherit" /> : "Покинуть"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default LeaveCompanyDialog;