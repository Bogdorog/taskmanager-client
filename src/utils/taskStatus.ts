export function getTaskStatusLabel(
    status: string,
): string {

    switch (status) {

        case "BACKLOG":
            return "В ожидании";

        case "IN_PROGRESS":
            return "В работе";

        case "ON_REVIEW":
            return "На проверке";

        case "DONE":
            return "Завершена";

        case "CANCELLED":
            return "Отменена";

        default:
            return status;
    }
}