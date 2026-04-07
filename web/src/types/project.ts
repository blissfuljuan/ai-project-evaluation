export interface Project {
  id: number;
  title: string;
  description: string;
  courseClassId?: number;
  courseClassCode?: string;
  courseClassTitle?: string;
  createdAt?: string;
}

export interface CreateProjectRequest {
  title: string;
  description: string;
  courseClassId: number;
}
