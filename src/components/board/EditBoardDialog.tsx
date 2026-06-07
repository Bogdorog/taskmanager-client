import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";

import {
    useEffect,
    useState,
} from "react";

interface Props {

    open: boolean;

    initialName: string;

    initialDescription: string;

    onClose: () => void;

    onSubmit: (
        name: string,
        description: string,
    ) => void;
}

function EditBoardDialog({
                             open,
                             initialName,
                             initialDescription,
                             onClose,
                             onSubmit,
                         }: Props) {

    const [name, setName] =
        useState("");

    const [description,
        setDescription] =
        useState("");

    useEffect(() => {

        setName(initialName);

        setDescription(
            initialDescription,
        );

    }, [
        initialName,
        initialDescription,
    ]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
        >

            <DialogTitle>
                Редактировать доску
            </DialogTitle>

            <DialogContent>

                <TextField
                    fullWidth
                    label="Название"
                    margin="normal"
                    value={name}
                    onChange={e =>
                        setName(
                            e.target.value,
                        )
                    }
                />

                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Описание"
                    margin="normal"
                    value={description}
                    onChange={e =>
                        setDescription(
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
                    onClick={() =>
                        onSubmit(
                            name,
                            description,
                        )
                    }
                >
                    Сохранить
                </Button>

            </DialogActions>

        </Dialog>
    );
}

export default EditBoardDialog;