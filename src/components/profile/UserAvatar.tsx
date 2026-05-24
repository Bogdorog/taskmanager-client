import { Avatar } from "@mui/material";

import type { UserDto } from "@/types/user.ts";

import { getInitials }
    from "@/utils/avatar.ts";

function UserAvatar({
                        user,
                        size = 120,
                    }: {
    user: UserDto;
    size?: number;
}) {

    return (
        <Avatar
            src={user.avatarUrl || undefined}
            sx={{
                width: size,
                height: size,
                fontSize: size / 3,
            }}
        >
            {!user.avatarUrl &&
                getInitials(user.fullName)}
        </Avatar>
    );
}

export default UserAvatar;