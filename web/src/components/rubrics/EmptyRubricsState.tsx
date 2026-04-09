import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EmptyRubricsStateProps {
  canCreate: boolean;
  onCreate: () => void;
}

export function EmptyRubricsState({
  canCreate,
  onCreate,
}: EmptyRubricsStateProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>No rubrics yet</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Build a reusable grading rubric with weighted criteria for your class.
        </p>

        <Button disabled={!canCreate} onClick={onCreate}>
          Create Rubric
        </Button>
      </CardContent>
    </Card>
  );
}
