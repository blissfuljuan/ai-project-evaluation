import { http } from "./http";
import type { CourseClass, CourseClassRequest } from "@/types/course-class";

export const classApi = {
  async listMine(): Promise<CourseClass[]> {
    const { data } = await http.get<CourseClass[]>("/api/classes/me");
    return data;
  },

  async listTeaching(): Promise<CourseClass[]> {
    const { data } = await http.get<CourseClass[]>("/api/classes/teaching");
    return data;
  },

  async create(payload: CourseClassRequest): Promise<CourseClass> {
    const { data } = await http.post<CourseClass>("/api/classes", payload);
    return data;
  },

  async update(id: number, payload: CourseClassRequest): Promise<CourseClass> {
    const { data } = await http.put<CourseClass>(`/api/classes/${id}`, payload);
    return data;
  },

  async remove(id: number): Promise<void> {
    await http.delete(`/api/classes/${id}`);
  },
};
