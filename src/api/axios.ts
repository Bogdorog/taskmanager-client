import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:54455/api",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    // Список публичных URL, где токен не нужен
    const publicUrls = ["/auth"];
    if (config.url && publicUrls.some(publicUrl => config.url?.startsWith(publicUrl))) {
        return config;
    }
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;