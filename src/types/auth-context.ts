import type {AuthResponse, UserShortDto} from "@/types/auth.ts";

export interface AuthContextType {
    user: UserShortDto | null;
    accessToken: string | null;
    login: (data: AuthResponse) => void;
    logout: () => void;
    isAuthenticated: boolean;
}