import { Pencil, Trash2 } from "lucide-react";

import type { Rubric } from "@/types/rubric";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface RubricCardProps {
  rubric: Rubric;
  onEdit: (rubric: Rubric) => void;
  onDelete: (rubric: Rubric) => void;
}

export function RubricCard({ rubric, onEdit, onDelete }: RubricCardProps) {
  const totalWeight = rubric.criteria.reduce(
    (sum, criterion) => sum + criterion.weight,
    0
  );

  return (
    <Card className="h-full">
      <CardHeader className="space-y-3">
        <div className="space-y-1">
          <CardTitle className="text-xl">{rubric.name}</CardTitle>
          <CardDescription>
            {rubric.courseClassCode
              ? `${rubric.courseClassCode} - ${rubric.courseClassTitle ?? "Class"}`
              : "Unassigned class"}
          </CardDescription>
        </div>

        <p className="text-sm text-muted-foreground">
          {rubric.description || "No description provided."}
        </p>
      </CardHeader>

      <CardContent className="space-y-4 text-sm">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border p-3">
            <p className="text-muted-foreground">Criteria</p>
            <p className="text-lg font-semibold">{rubric.criteria.length}</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-muted-foreground">Weight Total</p>
            <p className="text-lg font-semibold">{totalWeight}%</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-muted-foreground">Max Points</p>
            <p className="text-lg font-semibold">
              {rubric.criteria.reduce((sum, criterion) => sum + criterion.maxScore, 0)}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="font-medium">Criteria</p>
          <div className="space-y-2">
            {rubric.criteria.map((criterion) => (
              <div
                key={criterion.id}
                className="rounded-lg border border-dashed p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="font-medium">{criterion.criterionName}</p>
                    <p className="text-muted-foreground">
                      {criterion.description || "No criterion description provided."}
                    </p>
                  </div>
                  <div className="shrink-0 text-right text-muted-foreground">
                    <p>{criterion.weight}%</p>
                    <p>{criterion.maxScore} pts</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="gap-3 sm:justify-end">
        <Button variant="outline" onClick={() => onEdit(rubric)}>
          <Pencil />
          Edit
        </Button>
        <Button variant="destructive" onClick={() => onDelete(rubric)}>
          <Trash2 />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
