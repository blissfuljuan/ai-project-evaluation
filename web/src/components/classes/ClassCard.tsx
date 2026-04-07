import type { CourseClass } from "@/types/course-class";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ClassCardProps {
  courseClass: CourseClass;
  deleting?: boolean;
  onEdit: (courseClass: CourseClass) => void;
  onDelete: (courseClass: CourseClass) => Promise<void>;
}

export function ClassCard({
  courseClass,
  deleting = false,
  onEdit,
  onDelete,
}: ClassCardProps) {
  return (
    <Card>
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
      <CardContent className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button variant="outline" onClick={() => onEdit(courseClass)}>
          Edit
        </Button>
        <Button
          variant="destructive"
          disabled={deleting}
          onClick={() => void onDelete(courseClass)}
        >
          {deleting ? "Deleting..." : "Delete"}
        </Button>
      </CardContent>
    </Card>
  );
}
