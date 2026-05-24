import {
    Paper,
    Typography,
} from "@mui/material";

function StatCard({
                      title,
                      value,
                  }: {
    title: string;
    value: number | string;
}) {

    return (
        <Paper
            elevation={3}
            sx={{
                p: 4,
                borderRadius: 5,
                flex: 1,
                minWidth: 220,
            }}
        >

            <Typography
                variant="body1"
                color="text.secondary"
            >
                {title}
            </Typography>

            <Typography
                variant="h3"
                sx={{
                    mt: 2,
                    fontWeight: 700,
                }}
            >
                {value}
            </Typography>

        </Paper>
    );
}

export default StatCard;