// Хелпер для превращения даты (строка ISO или массив [YYYY, MM, DD, HH, mm, ss]) в объект Date
export function parseNotificationDate(dateValue: string | number[] | undefined | null): Date {
    if (!dateValue) return new Date();

    if (Array.isArray(dateValue)) {
        const [year, month, day, hour = 0, minute = 0, second = 0] = dateValue;
        return new Date(year, month - 1, day, hour, minute, second);
    }

    return new Date(dateValue);
}

// Интерфейс для удобной типизации ожидаемых полей в payload
interface NotificationPayload {
    taskTitle?: string;
    columnName?: string;
    memberName?: string;
    roleName?: string;
    companyName?: string;
    daysLeft?: number;
    [key: string]: any;
}

/**
 * Превращает тип уведомления и его payload в понятное русскоязычное сообщение для UI и Тостов
 */
export function formatNotificationText(type: string, payload: unknown): string {
    if (!payload) return "Новое уведомление";
    if (typeof payload === "string") return payload;

    const data = payload as NotificationPayload;
    const taskTitle = data.taskTitle ? `«${data.taskTitle}»` : "задачи";
    const companyName = data.companyName ? `в «${data.companyName}»` : "";
    const roleName = data.roleName ? `«${data.roleName}»` : "";

    switch (type) {
        // --- СОБЫТИЯ ЗАДАЧ ---
        case "TASK_CREATED":
            return `Создана новая задача: ${taskTitle}`;

        case "TASK_UPDATED":
            return `Изменены параметры задачи ${taskTitle}`;

        case "TASK_MOVED":
            return data.columnName
                ? `Задача ${taskTitle} перемещена в колоночку «${data.columnName}»`
                : `Задача ${taskTitle} перемещена`;

        case "TASK_DELETED":
            return `Удалена задача ${taskTitle}`;

        case "TASK_ASSIGNED":
            return `Вы назначены исполнителем задачи ${taskTitle}`;

        case "TASK_DEADLINE_APPROACHING":
            return data.daysLeft !== undefined
                ? `Приближается дедлайн по задаче ${taskTitle} (осталось дней: ${data.daysLeft})`
                : `Приближается крайний срок по задаче ${taskTitle}`;

        case "TASK_DEADLINE_OVERDUE":
            return `⚠️ Просрочен дедлайн по задаче ${taskTitle}!`;

        // --- СОБЫТИЯ УЧАСТНИКОВ И РОЛЕЙ ---
        case "MEMBER_ADDED":
            return data.memberName
                ? `Участник ${data.memberName} добавлен ${companyName}`.trim()
                : `Вы или новый участник добавлены ${companyName}`.trim();

        case "ROLE_ADDED":
            return roleName
                ? `Вам присвоена новая роль ${roleName} ${companyName}`.trim()
                : `Обновлены ваши роли ${companyName}`.trim();

        default:
            return data.taskTitle ? `Уведомление по задаче ${taskTitle}` : JSON.stringify(payload);
    }
}