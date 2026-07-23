import {createContext} from "react";
import type {NotificationContextType} from "@/types/notification-context.ts";

export const NotificationContext =
    createContext<NotificationContextType>({ isConnected: false });