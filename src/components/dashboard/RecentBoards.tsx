import {
    Box,
    Paper,
    Typography,
} from "@mui/material";

import type {
    BoardDto
} from "@/types/board";

function RecentBoards({
                          boards,
                      }: {
    boards: BoardDto[];
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
                    mb: 3,
                }}
            >
                Последние доски
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}
            >

                {boards.map(board => (

                    <Paper
                        key={board.id}
                        variant="outlined"
                        sx={{
                            p: 2,
                            borderRadius: 3,
                        }}
                    >

                        <Typography
                            variant="h6"
                        >
                            {board.name}
                        </Typography>

                        <Typography
                            color="text.secondary"
                        >
                            {
                                board.description
                            }
                        </Typography>

                    </Paper>

                ))}

            </Box>

        </Paper>
    );
}

export default RecentBoards;