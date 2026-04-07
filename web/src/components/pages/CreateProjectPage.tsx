import { CreateProjectForm } from "@/components/projects/CreateProjectForm";

export function CreateProjectPage() {
  return (
    <div className="space-y-6">
      <section className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">New Project</h1>
        <p className="text-muted-foreground">
          Create a project record for a specific class.
        </p>
      </section>

      <CreateProjectForm />
    </div>
  );
}
