import { http } from "./http";
import type { CourseClass } from "@/types/course-class";

export const classApi = {
  async listMine(): Promise<CourseClass[]> {
    const { data } = await http.get<CourseClass[]>("/api/classes/me");
    return data;
  },
};
