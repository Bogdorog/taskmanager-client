import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {getCompany} from "@/api/companyApi.ts";
import {getBoards} from "@/api/boardApi.ts";

export function useCompanyData(companyId: number) {
    return useQuery({
        queryKey: ["companyPage", companyId],

        queryFn: async () => {
            try {
                const [company, boards] = await Promise.all([
                    getCompany(companyId),
                    getBoards(companyId),
                ]);
                return { company, boards };
            } catch (err) {
                let backendMessage = "Неизвестная ошибка сервера";

                if (axios.isAxiosError(err) && err.response?.data) {
                    backendMessage = err.response.data.message || err.response.data.error || backendMessage;
                } else if (err instanceof Error) {
                    backendMessage = err.message;
                }
                throw new Error(backendMessage, { cause: err });
            }
        },

        enabled: !isNaN(companyId) && companyId > 0,
        staleTime: 5 * 60 * 1000,
    });
}