import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {
    ThemeProvider,
    CssBaseline,
} from "@mui/material";
import theme from "@/theme/theme";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1, // Количество попыток перезапроса при ошибке
        },
    },
});

createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <App />
            </ThemeProvider>,
        </QueryClientProvider>
    </React.StrictMode>
);
