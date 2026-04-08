import { http } from "./http";
import type { CreateGroupRequest, Group, GroupMemberRole } from "@/types/group";

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

  async updateMemberRole(
    groupId: number,
    userId: number,
    role: GroupMemberRole,
  ): Promise<Group> {
    const { data } = await http.put<Group>(
      `/api/groups/${groupId}/members/${userId}/role`,
      { role },
    );
    return data;
  },

  async removeMember(groupId: number, userId: number): Promise<Group> {
    const { data } = await http.delete<Group>(
      `/api/groups/${groupId}/members/${userId}`,
    );
    return data;
  },
};
