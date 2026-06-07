import { Box, Chip, Paper, Typography } from "@mui/material";
import type { TaskShortDto } from "@/types/board";

interface Props {
    task: TaskShortDto;
    onClick?: () => void;
}

const priorityMap: Record<string, { label: string; color: "default" | "info" | "warning" | "error"; borderColor: string }> = {
    LOW: { label: "Низкий", color: "default", borderColor: "#E0E0E0" },
    MEDIUM: { label: "Средний", color: "info", borderColor: "#2196F3" },
    HIGH: { label: "Высокий", color: "warning", borderColor: "#FF9800" },
    CRITICAL: { label: "Критический", color: "error", borderColor: "#F44336" },
};

function TaskCard({ task, onClick }: Props) {
    const config = priorityMap[task.priority] || { label: task.priority, color: "default", borderColor: "#E0E0E0" };

    return (
        <Paper
            elevation={0}
            onClick={onClick}
            sx={{
                p: 2,
                cursor: "pointer",
                borderRadius: 2.5,
                border: "1px solid",
                borderColor: "divider",
                borderLeft: `4px solid ${config.borderColor}`, // Цветная полоса приоритета
                bgcolor: "#FFFFFF",
                transition: "all 0.15s ease-in-out",
                "&:hover": {
                    borderColor: "primary.light",
                    boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
                    transform: "translateY(-1px)"
                },
            }}
        >
            <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary", mb: 1.5, lineHeight: 1.4 }}>
                {task.title}
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Chip size="small" color={config.color} label={config.label} sx={{ fontSize: 11, fontWeight: 600, height: 20, variant: "combined" }} />

                {task.assignedTo && (
                    <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 500 }}>
                        {task.assignedTo.fullName}
                    </Typography>
                )}
            </Box>
        </Paper>
    );
}

export default TaskCard;