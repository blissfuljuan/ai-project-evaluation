import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EmptyProjectsStateProps {
  onCreate?: () => void;
}

export function EmptyProjectsState({ onCreate }: EmptyProjectsStateProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>No projects yet</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Start by creating your first software project record.
        </p>

        <Button onClick={onCreate}>Create Project</Button>
      </CardContent>
    </Card>
  );
}
