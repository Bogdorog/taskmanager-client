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
    useState,
} from "react";

import {
    assignRole,
} from "@/api/companyApi.ts";

import type {
    CompanyRoleDto,
} from "@/types/company.ts";

interface Props {
    open: boolean;
    onClose: () => void;
    companyId: number;
    membershipId: number;
    roles: CompanyRoleDto[];
    onSuccess: () => Promise<void>;
}

function AssignRoleDialog({
                              open,
                              onClose,
                              companyId,
                              membershipId,
                              roles,
                              onSuccess,
                          }: Props) {

    const [roleId,
        setRoleId] =
        useState("");

    async function handleSave() {

        await assignRole(
            companyId,
            membershipId,
            Number(roleId)
        );

        await onSuccess();

        onClose();
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
        >

            <DialogTitle>
                Назначить роль
            </DialogTitle>

            <DialogContent>

                <TextField
                    select
                    fullWidth
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

                <Button onClick={onClose}>
                    Отмена
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSave}
                >
                    Сохранить
                </Button>

            </DialogActions>

        </Dialog>
    );
}

export default AssignRoleDialog;