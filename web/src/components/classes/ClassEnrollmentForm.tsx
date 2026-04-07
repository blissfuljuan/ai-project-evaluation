import { useState, type FormEvent } from "react";

import { classApi } from "@/api/class.api";
import type { CourseClass } from "@/types/course-class";
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

interface ClassEnrollmentFormProps {
  onEnrolled: (courseClass: CourseClass) => void;
}

export function ClassEnrollmentForm({ onEnrolled }: ClassEnrollmentFormProps) {
  const [classCode, setClassCode] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      setSaving(true);
      const enrolled = await classApi.enroll({ classCode: classCode.trim() });
      onEnrolled(enrolled);
      setClassCode("");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Unable to enroll in class right now.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enroll In Class</CardTitle>
        <CardDescription>
          Enter a valid class code to join a course class.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="enrollClassCode">Class code</Label>
            <Input
              id="enrollClassCode"
              maxLength={50}
              placeholder="Enter class code"
              required
              value={classCode}
              onChange={(e) => setClassCode(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? "Enrolling..." : "Enroll"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
