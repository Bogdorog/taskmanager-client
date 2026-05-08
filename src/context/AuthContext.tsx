import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import type {AuthResponse, UserShortDto} from "@/types/auth";

interface AuthContextType {
    user: UserShortDto | null;
    accessToken: string | null;
    login: (data: AuthResponse) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

export function AuthProvider({
                                 children,
                             }: {
    children: React.ReactNode;
}) {

    const [user, setUser] = useState<UserShortDto | null>(null);

    const [accessToken, setAccessToken] = useState<string | null>(
        null
    );

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const userData = localStorage.getItem("user");

        if (token && userData) {
            setAccessToken(token);
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleLogin = (data: AuthResponse) => {
        localStorage.setItem(
            "accessToken",
            data.accessToken
        );

        localStorage.setItem(
            "refreshToken",
            data.refreshToken
        );

        localStorage.setItem(
            "user",
            JSON.stringify(data.user)
        );

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

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
}