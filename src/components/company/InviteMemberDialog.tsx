import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    TextField,
} from "@mui/material";

import {
    useState
} from "react";

import type {
    CompanyRoleDto
} from "@/types/company";

import {
    inviteUser
} from "@/api/companyApi";

function InviteMemberDialog({
                                open,
                                onClose,
                                companyId,
                                roles,
                            }: {
    open: boolean;
    onClose: () => void;
    companyId: number;
    roles: CompanyRoleDto[];
}) {

    const [userId,
        setUserId] =
        useState("");

    const [roleId,
        setRoleId] =
        useState("");

    const handleInvite =
        async () => {

            await inviteUser(
                companyId,
                {
                    userId:
                        Number(userId),

                    roleId:
                        Number(roleId),
                }
            );

            onClose();
        };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >

            <DialogTitle>
                Пригласить участника
            </DialogTitle>

            <DialogContent>

                <TextField
                    fullWidth
                    label="ID пользователя"
                    margin="normal"
                    value={userId}
                    onChange={(e) =>
                        setUserId(
                            e.target.value
                        )
                    }
                />

                <TextField
                    select
                    fullWidth
                    label="Роль"
                    margin="normal"
                    value={roleId}
                    onChange={(e) =>
                        setRoleId(
                            e.target.value
                        )
                    }
                >

                    {roles.map(role => (

                        <MenuItem
                            key={role.id}
                            value={role.id}
                        >
                            {role.name}
                        </MenuItem>

                    ))}

                </TextField>

            </DialogContent>

            <DialogActions>

                <Button
                    onClick={onClose}
                >
                    Отмена
                </Button>

                <Button
                    variant="contained"
                    onClick={handleInvite}
                >
                    Пригласить
                </Button>

            </DialogActions>

        </Dialog>
    );
}

export default InviteMemberDialog;