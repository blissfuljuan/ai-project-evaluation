import { useState, type FormEvent } from "react";

import type { CourseClass, CourseClassRequest } from "@/types/course-class";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ClassFormProps {
  initialValue?: CourseClass | null;
  saving?: boolean;
  onCancel?: () => void;
  onSubmit: (payload: CourseClassRequest) => Promise<void>;
}

export function ClassForm({
  initialValue,
  saving = false,
  onCancel,
  onSubmit,
}: ClassFormProps) {
  const [classCode, setClassCode] = useState(initialValue?.classCode ?? "");
  const [title, setTitle] = useState(initialValue?.title ?? "");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      await onSubmit({
        classCode: classCode.trim(),
        title: title.trim(),
      });

      if (!initialValue) {
        setClassCode("");
        setTitle("");
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Unable to save class right now.";
      setError(msg);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialValue ? "Edit Class" : "Create Class"}</CardTitle>
        <CardDescription>
          {initialValue
            ? "Update the class details for your course."
            : "Create a course class you can manage and use for projects."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="classCode">Class code</Label>
            <Input
              id="classCode"
              maxLength={50}
              placeholder="e.g. CSIT-401"
              required
              value={classCode}
              onChange={(e) => setClassCode(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              maxLength={150}
              placeholder="e.g. Software Engineering 2"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : initialValue ? "Update Class" : "Create Class"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
