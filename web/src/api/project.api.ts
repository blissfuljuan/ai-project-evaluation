import { http } from "./http";
import type { CreateProjectRequest, Project } from "@/types/project";

export const projectApi = {
  async listMine(): Promise<Project[]> {
    const { data } = await http.get<Project[]>("/api/projects/me");
    return data;
  },

  async create(payload: CreateProjectRequest): Promise<Project> {
    const { data } = await http.post<Project>("/api/projects", payload);
    return data;
  },
};
