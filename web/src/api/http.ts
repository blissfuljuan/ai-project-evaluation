import { tokenStore } from "@/auth/token";
import { notifySessionExpired } from "@/auth/session-expiry";
import axios, { AxiosError } from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const http = axios.create({
    baseURL,
    headers: { "Content-Type": "application/json" },
})

// Attach token automatically
http.interceptors.request.use((config) => {
    const token = tokenStore.get();
    if(token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

// Global 401 handling (optional but nice)
http.interceptors.response.use(
    (res) => res,
    (err: AxiosError) => {
        const status = err.response?.status;
        const requestUrl = err.config?.url ?? "";
        const hasToken = !!tokenStore.get();
        const isAuthAction = requestUrl.includes("/api/auth/login")
            || requestUrl.includes("/api/auth/register")
            || requestUrl.includes("/api/auth/logout");

        if(status === 401 && hasToken && !isAuthAction) {
            const message =
                (err.response?.data as { message?: string } | undefined)?.message
                || "Session expired. Please log in again.";
            notifySessionExpired(message);
        }
        return Promise.reject(err);
    }
)
