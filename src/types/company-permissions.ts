export interface CompanyPermissions {

    canCreateTasks: boolean;

    canUpdateTasks: boolean;

    canDeleteTasks: boolean;

    canAssignTasks: boolean;

    canViewTasks: boolean;

    canViewAllTasks: boolean;

    canInviteUsers: boolean;

    canViewMembers: boolean;

    canManageMembers: boolean;

    canViewRoles: boolean;

    canManageRoles: boolean;

    canManageCompany: boolean;

    canManageBoards: boolean;
}

export const COMPANY_PERMISSIONS = [
    "CREATE_TASK",
    "UPDATE_TASK",
    "DELETE_TASK",
    "ASSIGN_TASK",
    "VIEW_MEMBERS",
    "VIEW_ROLES",
    "VIEW_ALL_TASKS",
    "MANAGE_COMPANY",
    "MANAGE_MEMBERS",
    "MANAGE_ROLES",
    "INVITE_USER",
    "MANAGE_BOARDS",
] as const;

export type Permission =
    typeof COMPANY_PERMISSIONS[number];