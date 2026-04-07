import { Button } from "@/components/ui/button";

interface ProjectPageHeaderProps {
  onCreate?: () => void;
}

export function ProjectPageHeader({ onCreate }: ProjectPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <p className="text-muted-foreground">
          Manage software project records and project details.
        </p>
      </div>

      <Button onClick={onCreate}>New Project</Button>
    </div>
  );
}
