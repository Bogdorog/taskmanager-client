export const PERMISSION_TRANSLATIONS: Record<string, { label: string; desc: string }> = {
    CREATE_TASK: { label: "Создание задач", desc: "Создание задач на любой из досок компании" },
    UPDATE_TASK: { label: "Редактирование задач", desc: "Редактирование задач на любой из досок компании" },
    DELETE_TASK: { label: "Удаление задач", desc: "Удаление задач на любой из досок компании" },
    ASSIGN_TASK: { label: "Назначение задач", desc: "Назначение задач на любой из досок компании любому сотруднику компании" },
    VIEW_MEMBERS: { label: "Просмотр сотрудников", desc: "Доступ к списку сотрудников компании" },
    VIEW_ROLES: { label: "Просмотр ролей", desc: "Доступ к списку ролей компании" },
    VIEW_ALL_TASKS: { label: "Просмотр всех задач", desc: "Доступ ко всем задачам компании" },
    MANAGE_COMPANY: { label: "Управление компанией", desc: "Полный доступ к изменению профиля и удалению организации" },
    MANAGE_MEMBERS: { label: "Управление пользователями", desc: "Возможность менять роли сотрудикам компании или увольнять их" },
    MANAGE_ROLES: { label: "Управление ролями", desc: "Возможность создавать, редактировать и удалять роли" },
    INVITE_USER: { label: "Добавление пользователей", desc: "Возможность добавлять в компанию новых сотрудников" },
    MANAGE_BOARDS: { label: "Управление досками", desc: "Возможность создавать, редактировать и удалять доски" },
};

export const translatePermission = (key: string) => PERMISSION_TRANSLATIONS[key]?.label || key;