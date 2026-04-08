import { useEffect, useState, type FormEvent } from "react";

import { classApi } from "@/api/class.api";
import { groupApi } from "@/api/group.api";
import type { CourseClass } from "@/types/course-class";
import type { CreateGroupRequest, Group } from "@/types/group";
import type { UserSummary } from "@/types/user";
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
}

export function CreateGroupForm({ classes, onCreated }: CreateGroupFormProps) {
  const [groupName, setGroupName] = useState("");
  const [courseClassId, setCourseClassId] = useState("");
  const [eligibleMembers, setEligibleMembers] = useState<UserSummary[]>([]);
  const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>([]);
  const [pendingMemberId, setPendingMemberId] = useState("");
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEligibleMembers = async () => {
      if (!courseClassId) {
        setEligibleMembers([]);
        setSelectedMemberIds([]);
        setPendingMemberId("");
        return;
      }

      try {
        setLoadingMembers(true);
        const data = await classApi.listEligibleGroupMembers(Number(courseClassId));
        setEligibleMembers(data);
        setSelectedMemberIds([]);
        setPendingMemberId("");
      } catch (err: any) {
        const msg =
          err?.response?.data?.message ||
          "Unable to load eligible classmates for this class.";
        setError(msg);
      } finally {
        setLoadingMembers(false);
      }
    };

    void loadEligibleMembers();
  }, [courseClassId]);

  const handleAddMember = () => {
    if (!pendingMemberId) return;

    const memberId = Number(pendingMemberId);
    setSelectedMemberIds((current) =>
      current.includes(memberId) ? current : [...current, memberId]
    );
    setPendingMemberId("");
  };

  const handleRemoveMember = (memberId: number) => {
    setSelectedMemberIds((current) => current.filter((id) => id !== memberId));
  };

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
      memberUserIds: selectedMemberIds,
    };

    try {
      setSaving(true);
      const created = await groupApi.create(payload);
      onCreated(created);
      setGroupName("");
      setCourseClassId("");
      setEligibleMembers([]);
      setSelectedMemberIds([]);
      setPendingMemberId("");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Unable to create group right now.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const availableToAdd = eligibleMembers.filter(
    (member) => !selectedMemberIds.includes(member.id)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Group</CardTitle>
        <CardDescription>
          Create a group within one enrolled class and add classmates from the
          same class.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="courseClassId">Class</Label>
            <Select value={courseClassId} onValueChange={setCourseClassId}>
              <SelectTrigger id="courseClassId" className="w-full">
                <SelectValue placeholder="Select enrolled class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((courseClass) => (
                  <SelectItem
                    key={courseClass.id}
                    value={String(courseClass.id)}
                  >
                    {courseClass.classCode} - {courseClass.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
            <Label>Add members</Label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Select
                disabled={!courseClassId || loadingMembers || availableToAdd.length === 0}
                value={pendingMemberId}
                onValueChange={setPendingMemberId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      loadingMembers
                        ? "Loading classmates..."
                        : "Select eligible classmate"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {availableToAdd.map((member) => (
                    <SelectItem key={member.id} value={String(member.id)}>
                      {member.firstname} {member.lastname} ({member.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="outline"
                onClick={handleAddMember}
                disabled={!pendingMemberId}
              >
                Add Member
              </Button>
            </div>
            <div className="space-y-2">
              {selectedMemberIds.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No members added yet. You will be included automatically as the
                  group creator.
                </p>
              ) : (
                selectedMemberIds.map((memberId) => {
                  const member = eligibleMembers.find((item) => item.id === memberId);
                  if (!member) return null;

                  return (
                    <div
                      key={member.id}
                      className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                    >
                      <span>
                        {member.firstname} {member.lastname} ({member.email})
                      </span>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={saving || !courseClassId || classes.length === 0}
            >
              {saving ? "Creating..." : "Create Group"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
