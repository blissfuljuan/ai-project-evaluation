import { http } from "./http";
import type { UserResponse } from "@/types/user";

export const userApi = {
    async me(): Promise<UserResponse> {
        const { data } = await http.get<UserResponse>("/api/user/me");
        return data;
    }
}