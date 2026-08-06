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
    daysLeft?: number;
    actorName?: string;
    [key: string]: any;
}

/**
 * Превращает тип уведомления и его payload в понятное русскоязычное сообщение для UI и Тостов
 */
export function formatNotificationText(type: string, payload: unknown): string {
    if (!payload) return "Новое уведомление";
    if (typeof payload === "string") return payload;

    const data = payload as NotificationPayload;

    switch (type) {
        // --- СОБЫТИЯ ЗАДАЧ ---
        case "TASK_CREATED":
            return `Создана новая задача: ${data.taskTitle}`;

        case "TASK_UPDATED":
            return `Изменены параметры задачи ${data.taskTitle}`;

        case "TASK_MOVED":
            return data.columnName
                ? `Задача ${data.taskTitle} перемещена в столбец «${data.columnName}»`
                : `Задача ${data.taskTitle} перемещена`;

        case "TASK_DELETED":
            return `Удалена задача ${data.taskTitle}`;

        case "TASK_ASSIGNED":
            return `Вы назначены исполнителем задачи ${data.taskTitle}`;

        case "TASK_DEADLINE_APPROACHING":
            return data.daysLeft !== undefined
                ? `Приближается дедлайн по задаче ${data.taskTitle} (осталось дней: ${data.daysLeft})`
                : `Приближается крайний срок по задаче ${data.taskTitle}`;

        case "TASK_DEADLINE_OVERDUE":
            return `⚠️ Просрочен дедлайн по задаче ${data.taskTitle}!`;

        // --- СОБЫТИЯ УЧАСТНИКОВ И РОЛЕЙ ---
        case "MEMBER_ADDED":
            return `${data.actorName} добавил(а) ${data.memberName} в компанию с ролью ${data.roleName}`;

        case "MEMBER_ROLE_CHANGED":
            return `${data.actorName} назначил(а) ${data.memberName} роль ${data.roleName}`;

        case "MEMBER_DELETED":
            return `${data.actorName} удалил(а) ${data.memberName} с ролью ${data.roleName} из компании`;

        case "MEMBER_LEFT":
            return `${data.actorName} с ролью ${data.roleName} покинул(а) компанию`;

        case "ROLE_ADDED":
            return `${data.actorName} создал(а) роль ${data.roleName}`;

        case "ROLE_CHANGED":
            return `${data.actorName} изменил(а) роль ${data.roleName}`;

        case "ROLE_DELETED":
            return `${data.actorName} удалил(а) роль ${data.roleName}`;

        default:
            return data.taskTitle ? `Уведомление по задаче ${data.taskTitle}` : JSON.stringify(payload);
    }
}