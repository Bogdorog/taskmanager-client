export const getRoleLabel = (
    role: string
): string => {

    switch (role) {

        case "ADMIN":
            return "Администратор";

        case "USER":
            return "Пользователь";

        default:
            return role;
    }
};