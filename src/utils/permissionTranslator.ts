export const PERMISSION_TRANSLATIONS: Record<string, { label: string; desc: string }> = {
    canManageCompany: { label: "Управление компанией", desc: "Полный доступ к изменению профиля и удалению организации" },
    canViewMembers: { label: "Просмотр сотрудников", desc: "Доступ к списку участников компании" },
    canInviteUsers: { label: "Приглашение пользователей", desc: "Возможность высылать инвайты новым коллегам" },
    canViewRoles: { label: "Просмотр ролей", desc: "Доступ к списку ролей безопасности" },
    canManageRoles: { label: "Управление ролями", desc: "Создание, редактирование и привязка прав к ролям" },
    canCreateBoards: { label: "Создание досок", desc: "Возможность разворачивать новые канбан-пространства" },
};

export const translatePermission = (key: string) => PERMISSION_TRANSLATIONS[key]?.label || key;