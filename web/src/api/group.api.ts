import { http } from "./http";
import type { CreateGroupRequest, Group } from "@/types/group";

export const groupApi = {
  async listMine(): Promise<Group[]> {
    const { data } = await http.get<Group[]>("/api/groups/me");
    return data;
  },

  async create(payload: CreateGroupRequest): Promise<Group> {
    const { data } = await http.post<Group>("/api/groups", payload);
    return data;
  },

  async addMember(groupId: number, userId: number): Promise<Group> {
    const { data } = await http.post<Group>(`/api/groups/${groupId}/members`, {
      userId,
    });
    return data;
  },
};
