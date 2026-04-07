import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{project.title}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2 text-sm">
        <p className="text-muted-foreground">
          {project.description || "No description provided."}
        </p>

        {project.courseClassCode && (
          <p>
            <span className="font-medium">Course:</span>{" "}
            {project.courseClassCode}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
