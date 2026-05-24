import {
    Box,
    Button,
} from "@mui/material";

function AvatarUpload({
                          onUpload,
                      }: {
    onUpload: (file: File) => void;
}) {

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        const file = e.target.files?.[0];

        if (file) {
            onUpload(file);
        }
    };

    return (
        <Box mt={2}>

            <Button
                variant="outlined"
                component="label"
            >
                Изменить фото

                <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                />

            </Button>

        </Box>
    );
}

export default AvatarUpload;