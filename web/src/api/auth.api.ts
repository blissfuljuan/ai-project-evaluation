import { http } from "./http"
import type { ApiResponse, AuthResponse, LoginRequest, RegisterRequest } from "@/types/auth";

export const authApi = {
    async register(payload: RegisterRequest): Promise<ApiResponse> {
        const { data } = await http.post<ApiResponse>("/api/auth/register", payload);
        return data;
    },

    async login(payload: LoginRequest): Promise<AuthResponse> {
        const { data } = await http.post<AuthResponse>("/api/auth/login", payload);
        return data;
    },

    async logout(): Promise<ApiResponse> {
        const { data } = await http.post<ApiResponse>("/api/auth/logout");
        return data;
    },
}