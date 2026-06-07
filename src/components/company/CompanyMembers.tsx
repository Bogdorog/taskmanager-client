import { Avatar, Box, Paper, Typography, Chip, List, ListItem, ListItemAvatar, ListItemText, Divider } from "@mui/material";
import BadgeIcon from "@mui/icons-material/Badge";
import type { CompanyMembershipDto } from "@/types/company";

// Функция генерации приятного цвета на основе хэша логина участника
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
    return fullName
        .split(" ")
        .filter(Boolean)
        .map((word) => word[0])
        .slice(0, 2) // Берем максимум 2 буквы (Имя, Фамилия)
        .join("")
        .toUpperCase();
}

function CompanyMembers({ members }: { members: CompanyMembershipDto[] }) {
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
                {members.map((member, index) => (
                    <Box key={member.id}>
                        <ListItem
                            secondaryAction={
                                <Chip
                                    label={member.role.name}
                                    variant="className"
                                    size="small"
                                    sx={{
                                        fontWeight: 600,
                                        bgcolor: "rgba(53, 91, 61, 0.08)",
                                        color: "primary.main",
                                        borderRadius: 1.5
                                    }}
                                />
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
                ))}
            </List>
        </Paper>
    );
}

export default CompanyMembers;