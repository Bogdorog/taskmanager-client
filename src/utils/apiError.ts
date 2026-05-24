import axios, { AxiosError } from "axios";
import type {ApiErrorResponse} from "@/types/api";

export function getApiErrorMessage(
    error: unknown
): string {

    if (axios.isAxiosError(error)) {

        const axiosError =
            error as AxiosError<ApiErrorResponse>;

        return (
            axiosError.response?.data?.message ??
            "Ошибка сервера"
        );
    }

    return "Неизвестная ошибка";
}