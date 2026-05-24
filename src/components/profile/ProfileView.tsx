import {
    Box,
    Button,
    Divider,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import type { UserDto }
    from "@/types/user.ts";

import UserAvatar
    from "@/components/profile/UserAvatar.tsx";

import {
    getRoleLabel
} from "@/utils/role.ts";

function InfoRow({
    label,
    value,
}: {
    label: string;
    value: string;
}) {

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2.5,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                backgroundColor: "grey.50",
            }}
        >

            <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                    mb: 0.5,
                    fontWeight: 500,
                }}
            >
                {label}
            </Typography>

            <Typography
                variant="h6"
                sx={{
                    fontWeight: 600,
                    wordBreak: "break-word",
                }}
            >
                {value}
            </Typography>

        </Paper>
    );
}

function ProfileView({
    user,
    onEdit,
    onChangePassword,
}: {
    user: UserDto;
    onEdit: () => void;
    onChangePassword: () => void;
}) {

    return (
        <Paper
            elevation={4}
            sx={{
                width: "100%",
                maxWidth: 850,
                borderRadius: 5,
                overflow: "hidden",
            }}
        >

            <Box
                sx={{
                    p: 5,
                    background:
                        "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                    color: "white",
                }}
            >

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                    }}
                >

                    <UserAvatar
                        user={user}
                        size={120}
                    />

                    <Box>

                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                mb: 1,
                            }}
                        >
                            {user.fullName}
                        </Typography>

                        <Typography
                            variant="h6"
                            sx={{
                                opacity: 0.9,
                                mb: 1,
                            }}
                        >
                            @{user.login}
                        </Typography>

                        <Box
                            sx={{
                                display: "inline-flex",
                                px: 2,
                                py: 0.7,
                                borderRadius: 10,
                                backgroundColor:
                                    "rgba(255,255,255,0.15)",
                                backdropFilter: "blur(8px)",
                            }}
                        >

                            <Typography
                                variant="body1"
                                sx={{
                                    fontWeight: 600,
                                }}
                            >
                                {getRoleLabel(user.role)}
                            </Typography>

                        </Box>

                    </Box>

                </Box>

            </Box>

            <Divider />

            <Box
                sx={{
                    p: 5,
                }}
            >

                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 700,
                        mb: 3,
                    }}
                >
                    Информация о пользователе
                </Typography>

                <Stack spacing={2.5}>

                    <InfoRow
                        label="Электронная почта"
                        value={user.email}
                    />

                    <InfoRow
                        label="Телефон"
                        value={user.phone}
                    />

                    <InfoRow
                        label="Адрес"
                        value={user.address}
                    />

                </Stack>

                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        mt: 5,
                    }}
                >

                    <Button
                        variant="contained"
                        size="large"
                        onClick={onEdit}
                        sx={{
                            px: 4,
                            py: 1.3,
                            borderRadius: 3,
                            textTransform: "none",
                            fontSize: 16,
                            fontWeight: 600,
                        }}
                    >
                        Редактировать профиль
                    </Button>

                    <Button
                        variant="outlined"
                        size="large"
                        onClick={onChangePassword}
                        sx={{
                            px: 4,
                            py: 1.3,
                            borderRadius: 3,
                            textTransform: "none",
                            fontSize: 16,
                            fontWeight: 600,
                        }}
                    >
                        Сменить пароль
                    </Button>

                </Box>

            </Box>

        </Paper>
    );
}

export default ProfileView;
