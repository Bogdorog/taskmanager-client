import {createContext} from "react";
import type {AuthContextType} from "@/types/auth-context.ts";

export const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);
