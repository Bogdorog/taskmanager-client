import { createContext } from "react";

import type {
    CompanyContextType
} from "@/types/company-context";

export const CompanyContext =
    createContext<CompanyContextType | null>(null);