import { useEffect, useState } from "react";

import { classApi } from "@/api/class.api";
import { groupApi } from "@/api/group.api";
import { CreateGroupForm } from "@/components/groups/CreateGroupForm";
import { GroupCard } from "@/components/groups/GroupCard";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/context/UserContext";
import type { CourseClass } from "@/types/course-class";
import type { Group } from "@/types/group";

export function GroupsPage() {
  const { user } = useUser();
  const [classes, setClasses] = useState<CourseClass[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [classData, groupData] = await Promise.all([
          classApi.listMine(),
          groupApi.listMine(),
        ]);
        setClasses(classData);
        setGroups(groupData);
      } catch (err: any) {
        const msg =
          err?.response?.data?.message || "Unable to load groups right now.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, []);

  const isStudentView = user?.role === "STUDENT" || user?.role === "ADMIN";

  if (!isStudentView) {
    return (
      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">Groups</h1>
        <p className="text-sm text-muted-foreground">
          Group formation is currently available to students only.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Groups</h1>
        <p className="text-muted-foreground">
          Create a group within your enrolled class and add classmates from the
          same class.
        </p>
      </section>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <CreateGroupForm
        classes={classes}
        onCreated={(group) => {
          setGroups((current) => [group, ...current]);
        }}
      />

      <Separator />

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">My Groups</h2>
          <p className="text-sm text-muted-foreground">
            Each class allows only one group membership per student.
          </p>
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading groups...</p>
        ) : groups.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            You are not part of any group yet.
          </p>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {groups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
