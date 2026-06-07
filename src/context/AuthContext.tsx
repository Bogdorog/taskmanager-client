import {
    useState
} from "react";

import type {AuthResponse, UserShortDto} from "@/types/auth";
import { AuthContext } from "@/context/auth-context";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    // Считываем синхронно при инициализации, чтобы избежать мигания роутов
    const [user, setUser] = useState<UserShortDto | null>(() => {
        const userData = localStorage.getItem("user");
        return userData ? JSON.parse(userData) : null;
    });

    const [accessToken, setAccessToken] = useState<string | null>(() => {
        return localStorage.getItem("accessToken");
    });

    const handleLogin = (data: AuthResponse) => {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("user", JSON.stringify(data.user));
        setAccessToken(data.accessToken);
        setUser(data.user);
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        setAccessToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                accessToken,
                login: handleLogin,
                logout,
                isAuthenticated: !!accessToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}