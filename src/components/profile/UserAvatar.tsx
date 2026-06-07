import { useEffect, useState } from "react";
import { Avatar, CircularProgress } from "@mui/material";
import type { UserDto } from "@/types/user.ts";
import { getInitials } from "@/utils/avatar.ts";
import { downloadProtectedFile } from "@/api/attachmentApi.ts"; // Импортируй свою функцию

interface UserAvatarProps {
    user: UserDto;
    size?: number;
}

function UserAvatar({ user, size = 120 }: UserAvatarProps) {
    const [blobUrl, setBlobUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Если у пользователя нет аватарки, сбрасываем урл и ничего не качаем
        if (!user.avatarUrl) {
            setBlobUrl(null);
            return;
        }

        let isMounted = true;
        setLoading(true);

        // Скачиваем защищенный файл
        downloadProtectedFile(user.avatarUrl)
            .then((localUrl) => {
                if (isMounted) {
                    setBlobUrl(localUrl);
                }
            })
            .catch((err) => {
                console.error("Не удалось загрузить аватарку пользователя:", err);
                if (isMounted) setBlobUrl(null);
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        // Чистим за собой память при размонтировании или смене аватарки
        return () => {
            isMounted = false;
            if (blobUrl) {
                URL.revokeObjectURL(blobUrl);
            }
        };
    }, [user.avatarUrl]);

    // Анимация загрузки
    if (loading) {
        return (
            <Avatar sx={{ width: size, height: size, bgcolor: "grey.100" }}>
                <CircularProgress size={size / 3} />
            </Avatar>
        );
    }

    return (
        <Avatar
            src={blobUrl || undefined} // Передаем локальную blob-ссылку вместо прямой ссылки на бэк
            sx={{
                width: size,
                height: size,
                fontSize: size / 3,
                fontWeight: 600,
                bgcolor: "primary.main", // Цвет фолбека, если аватарки нет
            }}
        >
            {!blobUrl && getInitials(user.fullName)}
        </Avatar>
    );
}

export default UserAvatar;