import { tokenStore } from "@/auth/token";
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
        if(err.response?.status === 401) {
            tokenStore.clear();
        }
        return Promise.reject(err);
    }
)