import {
    Avatar,
    Box,
    Paper,
    Typography,
    Chip,
} from "@mui/material";

import type {
    CompanyMembershipDto
} from "@/types/company";

function getInitials(
    fullName: string
) {

    return fullName
        .split(" ")
        .map(word => word[0])
        .join("")
        .toUpperCase();
}

function CompanyMembers({
                            members,
                        }: {
    members: CompanyMembershipDto[];
}) {

    return (
        <Paper
            elevation={3}
            sx={{
                p: 4,
                borderRadius: 5,
            }}
        >

            <Typography
                variant="h5"
                sx={{
                    fontWeight: 700,
                    mb: 4,
                }}
            >
                Участники компании
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                }}
            >

                {members.map(member => (

                    <Paper
                        key={member.id}
                        variant="outlined"
                        sx={{
                            p: 3,
                            borderRadius: 4,
                            display: "flex",
                            justifyContent:
                                "space-between",
                            alignItems: "center",
                        }}
                    >

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                            }}
                        >

                            <Avatar
                                sx={{
                                    width: 56,
                                    height: 56,
                                    fontSize: 20,
                                }}
                            >
                                {getInitials(
                                    member.user.fullName
                                )}
                            </Avatar>

                            <Box>

                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 600,
                                    }}
                                >
                                    {
                                        member.user.fullName
                                    }
                                </Typography>

                                <Typography
                                    color="text.secondary"
                                >
                                    @{
                                    member.user.login
                                }
                                </Typography>

                            </Box>

                        </Box>

                        <Chip
                            label={
                                member.role.name
                            }
                            color="primary"
                        />

                    </Paper>

                ))}

            </Box>

        </Paper>
    );
}

export default CompanyMembers;