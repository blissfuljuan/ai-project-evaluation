import type { Rubric } from "@/types/rubric";
import { EmptyRubricsState } from "./EmptyRubricsState";
import { RubricCard } from "./RubricCard";

interface RubricListProps {
  rubrics: Rubric[];
  canCreate: boolean;
  onCreate: () => void;
  onEdit: (rubric: Rubric) => void;
  onDelete: (rubric: Rubric) => void;
}

export function RubricList({
  rubrics,
  canCreate,
  onCreate,
  onEdit,
  onDelete,
}: RubricListProps) {
  if (rubrics.length === 0) {
    return <EmptyRubricsState canCreate={canCreate} onCreate={onCreate} />;
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {rubrics.map((rubric) => (
        <RubricCard
          key={rubric.id}
          rubric={rubric}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
