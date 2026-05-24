import {
    Box,
    Button,
    Paper,
    TextField,
    Typography,
} from "@mui/material";

import {
    useState
} from "react";

import type {
    CreateCompanyRequest
} from "@/types/company";

function CompanyForm({
                         onSubmit,
                     }: {
    onSubmit:
        (
            data:
            CreateCompanyRequest
        ) => Promise<void>;
}) {

    const [formData,
        setFormData] =
        useState<CreateCompanyRequest>({
            name: "",
            description: "",
            email: "",
            phone: "",
            address: "",
        });

    const handleChange =
        (
            e:
            React.ChangeEvent<HTMLInputElement>
        ) => {

            setFormData({
                ...formData,
                [e.target.name]:
                e.target.value,
            });
        };

    return (
        <Paper
            elevation={4}
            sx={{
                maxWidth: 700,
                mx: "auto",
                p: 5,
                borderRadius: 5,
            }}
        >

            <Typography
                variant="h4"
                sx={{
                    fontWeight: 700,
                    mb: 4,
                }}
            >
                Создание компании
            </Typography>

            <Box
                component="form"
                onSubmit={(e) => {

                    e.preventDefault();

                    onSubmit(formData);
                }}
            >

                <TextField
                    fullWidth
                    label="Название"
                    name="name"
                    margin="normal"
                    value={formData.name}
                    onChange={handleChange}
                />

                <TextField
                    fullWidth
                    label="Описание"
                    name="description"
                    margin="normal"
                    multiline
                    minRows={4}
                    value={
                        formData.description
                    }
                    onChange={handleChange}
                />

                <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    margin="normal"
                    value={formData.email}
                    onChange={handleChange}
                />

                <TextField
                    fullWidth
                    label="Телефон"
                    name="phone"
                    margin="normal"
                    value={formData.phone}
                    onChange={handleChange}
                />

                <TextField
                    fullWidth
                    label="Адрес"
                    name="address"
                    margin="normal"
                    value={formData.address}
                    onChange={handleChange}
                />

                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{
                        mt: 4,
                        borderRadius: 3,
                        textTransform:
                            "none",
                        px: 5,
                    }}
                >
                    Создать компанию
                </Button>

            </Box>

        </Paper>
    );
}

export default CompanyForm;