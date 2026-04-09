import { http } from "./http";
import type { CreateRubricRequest, Rubric, UpdateRubricRequest } from "@/types/rubric";

export const rubricApi = {
  async listMine(): Promise<Rubric[]> {
    const { data } = await http.get<Rubric[]>("/api/rubrics/me");
    return data;
  },

  async getById(id: number): Promise<Rubric> {
    const { data } = await http.get<Rubric>(`/api/rubrics/${id}`);
    return data;
  },

  async create(payload: CreateRubricRequest): Promise<Rubric> {
    const { data } = await http.post<Rubric>("/api/rubrics", payload);
    return data;
  },

  async update(id: number, payload: UpdateRubricRequest): Promise<Rubric> {
    const { data } = await http.put<Rubric>(`/api/rubrics/${id}`, payload);
    return data;
  },

  async remove(id: number): Promise<void> {
    await http.delete(`/api/rubrics/${id}`);
  },
};
