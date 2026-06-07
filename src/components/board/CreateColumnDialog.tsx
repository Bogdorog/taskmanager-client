import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";

import {
    useState,
} from "react";

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (
        name: string,
    ) => Promise<void>;
}

function CreateColumnDialog({
                                open,
                                onClose,
                                onSubmit,
                            }: Props) {

    const [name, setName] =
        useState("");

    async function handleSubmit() {

        await onSubmit(name);

        setName("");

        onClose();
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
        >

            <DialogTitle>
                Новая колонка
            </DialogTitle>

            <DialogContent>

                <TextField
                    fullWidth
                    label="Название"
                    value={name}
                    onChange={e =>
                        setName(
                            e.target.value,
                        )
                    }
                />

            </DialogContent>

            <DialogActions>

                <Button
                    onClick={onClose}
                >
                    Отмена
                </Button>

                <Button
                    variant="contained"
                    onClick={
                        handleSubmit
                    }
                >
                    Создать
                </Button>

            </DialogActions>

        </Dialog>
    );
}

export default CreateColumnDialog;