import type { Project } from "@/types/project";
import { ProjectCard } from "./ProjectCard";
import { EmptyProjectsState } from "./EmptyProjectsState";

interface ProjectListProps {
  projects: Project[];
  onCreate?: () => void;
}

export function ProjectList({ projects, onCreate }: ProjectListProps) {
  if (projects.length === 0) {
    return <EmptyProjectsState onCreate={onCreate} />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
