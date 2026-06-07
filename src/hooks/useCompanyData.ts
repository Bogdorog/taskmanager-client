import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {getCompany} from "@/api/companyApi.ts";
import {getBoards} from "@/api/boardApi.ts"; // Импортируем для проверки типа ошибки

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
                // Извлекаем детальное сообщение от бэкенда, если оно есть
                let backendMessage = "Неизвестная ошибка сервера";

                if (axios.isAxiosError(err) && err.response?.data) {
                    // Обычно бэкенд возвращает ошибку в поле message, error или text
                    backendMessage = err.response.data.message || err.response.data.error || backendMessage;
                } else if (err instanceof Error) {
                    backendMessage = err.message;
                }

                // Выбрасываем новую ошибку с детальным описанием для React Query
                throw new Error(backendMessage, { cause: err });
            }
        },

        enabled: !isNaN(companyId) && companyId > 0,
        staleTime: 5 * 60 * 1000,
    });
}