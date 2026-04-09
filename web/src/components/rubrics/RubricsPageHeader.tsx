import { Button } from "@/components/ui/button";

interface RubricsPageHeaderProps {
  onCreate: () => void;
}

export function RubricsPageHeader({ onCreate }: RubricsPageHeaderProps) {
  return (
    <div className="flex flex-col items-start gap-4 text-left sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-1 text-left">
        <h1 className="text-3xl font-bold tracking-tight">Rubrics</h1>
        <p className="text-muted-foreground">
          Create and manage grading rubrics for your classes.
        </p>
      </div>

      <Button onClick={onCreate}>New Rubric</Button>
    </div>
  );
}
