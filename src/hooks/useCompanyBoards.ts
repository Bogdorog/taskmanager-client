import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getBoards } from "@/api/boardApi";

export function useCompanyBoards(companyId: number | undefined) {
    return useQuery({
        queryKey: ["companyBoards", companyId],
        queryFn: async () => {
            if (!companyId) throw new Error("ID компании не указан");
            try {
                return await getBoards(companyId);
            } catch (err) {
                let backendMessage = "Неизвестная ошибка при загрузке досок";
                if (axios.isAxiosError(err) && err.response?.data) {
                    backendMessage = err.response.data.message || err.response.data.error || backendMessage;
                } else if (err instanceof Error) {
                    backendMessage = err.message;
                }
                throw new Error(backendMessage, { cause: err });
            }
        },
        // Запрос пойдет только тогда, когда у нас реально есть ID компании
        enabled: Boolean(companyId && !isNaN(companyId) && companyId > 0),
        staleTime: 1 * 60 * 1000, // 1 минута
    });
}