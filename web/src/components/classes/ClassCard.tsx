import type { CourseClass } from "@/types/course-class";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ClassCardProps {
  courseClass: CourseClass;
  deleting?: boolean;
  onSelect?: (courseClass: CourseClass) => void;
  onEdit?: (courseClass: CourseClass) => void;
  onDelete?: (courseClass: CourseClass) => Promise<void>;
}

export function ClassCard({
  courseClass,
  deleting = false,
  onSelect,
  onEdit,
  onDelete,
}: ClassCardProps) {
  return (
    <Card
      className={onSelect ? "cursor-pointer transition-colors hover:bg-muted/40" : undefined}
      onClick={onSelect ? () => onSelect(courseClass) : undefined}
    >
      <CardHeader>
        <CardTitle className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="block text-base text-muted-foreground">
              {courseClass.classCode}
            </span>
            <span className="block text-xl">{courseClass.title}</span>
          </div>
        </CardTitle>
      </CardHeader>
      {(onEdit || onDelete) && (
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            {onEdit && (
              <Button
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(courseClass);
                }}
              >
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="destructive"
                disabled={deleting}
                onClick={(e) => {
                  e.stopPropagation();
                  void onDelete(courseClass);
                }}
              >
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
