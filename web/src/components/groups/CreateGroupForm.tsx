import { useState, type FormEvent } from "react";

import { groupApi } from "@/api/group.api";
import type { CourseClass } from "@/types/course-class";
import type { CreateGroupRequest, Group } from "@/types/group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateGroupFormProps {
  classes: CourseClass[];
  onCreated: (group: Group) => void;
  onCancel: () => void;
}

export function CreateGroupForm({
  classes,
  onCreated,
  onCancel,
}: CreateGroupFormProps) {
  const [groupName, setGroupName] = useState("");
  const [courseClassId, setCourseClassId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!courseClassId) {
      setError("Please select a class.");
      return;
    }

    const payload: CreateGroupRequest = {
      groupName: groupName.trim(),
      courseClassId: Number(courseClassId),
      memberUserIds: [],
    };

    try {
      setSaving(true);
      const created = await groupApi.create(payload);
      setGroupName("");
      setCourseClassId("");
      onCreated(created);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Unable to create group right now.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="groupName">Group name</Label>
        <Input
          id="groupName"
          maxLength={100}
          placeholder="Enter group name"
          required
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="courseClassId">Class</Label>
        <Select value={courseClassId} onValueChange={setCourseClassId}>
          <SelectTrigger id="courseClassId" className="w-full">
            <SelectValue placeholder="Select enrolled class" />
          </SelectTrigger>
          <SelectContent>
            {classes.map((courseClass) => (
              <SelectItem key={courseClass.id} value={String(courseClass.id)}>
                {courseClass.classCode} - {courseClass.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {classes.length === 0 && (
        <p className="text-sm text-muted-foreground">
          You need an enrolled class before creating a group.
        </p>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving || !courseClassId || classes.length === 0}>
          {saving ? "Creating..." : "Create Group"}
        </Button>
      </div>
    </form>
  );
}
