import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { projectApi } from "@/api/project.api";
import { ProjectPageHeader } from "@/components/projects/ProjectPageHeader";
import { ProjectList } from "@/components/projects/ProjectList";
import type { Project } from "@/types/project";

export function ProjectsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await projectApi.listMine();
        setProjects(data);
      } catch (err: any) {
        const msg =
          err?.response?.data?.message || "Unable to load your projects.";
        setError(msg);
      }
    };

    loadProjects();
  }, []);

  const handleCreateProject = () => {
    navigate("/app/projects/create");
  };

  return (
    <div className="space-y-6">
      <ProjectPageHeader onCreate={handleCreateProject} />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <ProjectList projects={projects} onCreate={handleCreateProject} />
    </div>
  );
}
