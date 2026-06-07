import { Box, Button, Stack } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface AvatarUploadProps {
    onUpload: (file: File) => void;
    onDelete: () => void;
    showDelete: boolean;
    disabled?: boolean;
}

function AvatarUpload({ onUpload, onDelete, showDelete, disabled }: AvatarUploadProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onUpload(file);
        }
        e.target.value = "";
    };

    return (
        <Box sx={{ mt: 2 }}>
            <Stack direction="row" sx={{ spacing: 1, justifyContent: "center" }}>
                <Button variant="outlined" component="label" disabled={disabled} sx={{ borderRadius: 2, textTransform: "none" }}>
                    Изменить фото
                    <input hidden type="file" accept="image/*" onChange={handleChange} />
                </Button>

                {showDelete && (
                    <Button
                        variant="text"
                        color="error"
                        disabled={disabled}
                        onClick={onDelete}
                        startIcon={<DeleteIcon />}
                        sx={{ borderRadius: 2, textTransform: "none" }}
                    >
                        Удалить
                    </Button>
                )}
            </Stack>
        </Box>
    );
}

export default AvatarUpload;