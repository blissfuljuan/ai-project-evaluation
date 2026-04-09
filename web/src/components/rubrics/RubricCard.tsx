import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import type { Rubric } from "@/types/rubric";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface RubricCardProps {
  rubric: Rubric;
}

export function RubricCard({ rubric }: RubricCardProps) {
  const navigate = useNavigate();
  const totalWeight = rubric.criteria.reduce(
    (sum, criterion) => sum + criterion.weight,
    0
  );
  const totalPoints = rubric.criteria.reduce(
    (sum, criterion) => sum + criterion.maxScore,
    0
  );

  return (
    <button
      className="w-full text-left"
      onClick={() => navigate(`/app/rubrics/${rubric.id}`)}
      type="button"
    >
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-xl">{rubric.name}</CardTitle>
              <CardDescription>
                {rubric.courseClassCode
                  ? `${rubric.courseClassCode} - ${rubric.courseClassTitle ?? "Class"}`
                  : "Unassigned class"}
              </CardDescription>
            </div>
            <ChevronRight className="mt-1 shrink-0 text-muted-foreground" />
          </div>

          <p className="line-clamp-2 text-sm text-muted-foreground">
            {rubric.description || "No description provided."}
          </p>
        </CardHeader>

        <CardContent className="grid gap-3 text-sm sm:grid-cols-3">
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
            <p className="text-lg font-semibold">{totalPoints}</p>
          </div>
        </CardContent>
      </Card>
    </button>
  );
}
