import React, { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { EventSourcePolyfill } from "event-source-polyfill";
import toast from "react-hot-toast";
import type { NotificationEventDto } from "@/api/notificationApi";
import { NotificationContext } from "./notification-context";
import {formatNotificationText, parseNotificationDate} from "@/utils/notificationUtils.ts";

interface SseErrorEvent {
    status?: number;
    message?: string;
}

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const queryClient = useQueryClient();
    const [token, setToken] = useState<string | null>(() => localStorage.getItem("accessToken"));
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const handleStorageChange = () => {
            const currentToken = localStorage.getItem("accessToken");
            if (currentToken !== token) {
                queryClient.clear();
                setToken(currentToken);
            }
        };

        window.addEventListener("storage", handleStorageChange);
        window.addEventListener("token-refreshed", handleStorageChange);
        const interval = setInterval(handleStorageChange, 1000);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener("token-refreshed", handleStorageChange);
            clearInterval(interval);
        };
    }, [token, queryClient]);

    useEffect(() => {
        if (!token) {
            queueMicrotask(() => {
                setIsConnected(false);
            });
            queryClient.removeQueries({ queryKey: ["notifications"] });
            return;
        }

        const eventSource = new EventSourcePolyfill("http://localhost:54455/api/notifications/subscribe", {
            headers: {
                "Authorization": `Bearer ${token}`
            },
            heartbeatTimeout: 45000,
        });

        eventSource.onopen = () => {
            setIsConnected(true);
        };

        eventSource.onmessage = (event) => {
            try {
                const rawNotification: NotificationEventDto = JSON.parse(event.data);

                const normalizedNotification: NotificationEventDto = {
                    ...rawNotification,
                    createdAt: Array.isArray(rawNotification.createdAt)
                        ? parseNotificationDate(rawNotification.createdAt).toISOString()
                        : rawNotification.createdAt
                };

                const toastMessage = formatNotificationText(
                    normalizedNotification.type,
                    normalizedNotification.payload
                );

                queryClient.setQueryData<NotificationEventDto[]>(["notifications", false], (oldData = []) => {
                    if (oldData.some(n => n.id === normalizedNotification.id)) return oldData;
                    return [normalizedNotification, ...oldData];
                });

                queryClient.setQueryData<NotificationEventDto[]>(["notifications", true], (oldData = []) => {
                    if (oldData.some(n => n.id === normalizedNotification.id)) return oldData;
                    return [normalizedNotification, ...oldData];
                });

                toast.success(toastMessage, { position: "top-right" });
            } catch (err) {
                console.error("Ошибка парсинга SSE сообщения:", err);
            }
        };

        eventSource.onerror = (event: unknown) => {
            const errorEvent = event as SseErrorEvent;
            console.error("Ошибка или разрыв SSE соединения", errorEvent);
            setIsConnected(false);

            if (errorEvent?.status === 401) {
                const latestToken = localStorage.getItem("accessToken");
                if (latestToken && latestToken !== token) {
                    setToken(latestToken);
                }
            }
        };

        return () => {
            eventSource.close();
            setIsConnected(false);
        };
    }, [token, queryClient]);

    return (
        <NotificationContext.Provider value={{ isConnected }}>
            {children}
        </NotificationContext.Provider>
    );
};