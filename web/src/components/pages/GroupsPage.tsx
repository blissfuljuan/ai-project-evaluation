import { useEffect, useState } from "react";

import { classApi } from "@/api/class.api";
import { groupApi } from "@/api/group.api";
import { CreateGroupForm } from "@/components/groups/CreateGroupForm";
import { GroupCard } from "@/components/groups/GroupCard";
import { GroupDetailsCard } from "@/components/groups/GroupDetailsCard";
import { GroupMembersTable } from "@/components/groups/GroupMembersTable";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/context/UserContext";
import type { CourseClass } from "@/types/course-class";
import type { Group } from "@/types/group";
import type { GroupMemberRole } from "@/types/group";
import type { UserSummary } from "@/types/user";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type GroupsPageData = {
  classData: CourseClass[];
  groupData: Group[];
};

let groupsPageDataRequest: Promise<GroupsPageData> | null = null;

function loadGroupsPageData() {
  if (!groupsPageDataRequest) {
    groupsPageDataRequest = Promise.all([
      classApi.listMine(),
      groupApi.listMine(),
    ])
      .then(([classData, groupData]) => ({ classData, groupData }))
      .finally(() => {
        groupsPageDataRequest = null;
      });
  }

  return groupsPageDataRequest;
}

export function GroupsPage() {
  const { user } = useUser();
  const [classes, setClasses] = useState<CourseClass[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [eligibleMembers, setEligibleMembers] = useState<UserSummary[]>([]);
  const [eligibleMembersLoading, setEligibleMembersLoading] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [addingMember, setAddingMember] = useState(false);
  const [memberActionId, setMemberActionId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [addMemberError, setAddMemberError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { classData, groupData } = await loadGroupsPageData();
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
  const isSelectedGroupLeader =
    !!selectedGroup &&
    !!user &&
    selectedGroup.groupLeader?.id === user.id;

  const handleGroupUpdated = (updatedGroup: Group) => {
    setGroups((current) =>
      current.map((group) => (group.id === updatedGroup.id ? updatedGroup : group)),
    );
    setSelectedGroup(updatedGroup);
  };

  const handleOpenAddMember = async () => {
    if (!selectedGroup) return;

    setAddMemberError(null);
    setSelectedMemberId("");
    setEligibleMembersLoading(true);
    setAddMemberOpen(true);

    try {
      const members = await classApi.listEligibleGroupMembers(
        selectedGroup.courseClassId,
      );
      setEligibleMembers(members);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Unable to load eligible members.";
      setAddMemberError(msg);
    } finally {
      setEligibleMembersLoading(false);
    }
  };

  const handleAddMember = async () => {
    if (!selectedGroup || !selectedMemberId) {
      setAddMemberError("Please select a member.");
      return;
    }

    setAddMemberError(null);

    try {
      setAddingMember(true);
      const updatedGroup = await groupApi.addMember(
        selectedGroup.id,
        Number(selectedMemberId),
      );
      handleGroupUpdated(updatedGroup);
      setEligibleMembers((current) =>
        current.filter((member) => member.id !== Number(selectedMemberId)),
      );
      setSelectedMemberId("");
      setAddMemberOpen(false);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Unable to add member right now.";
      setAddMemberError(msg);
    } finally {
      setAddingMember(false);
    }
  };

  const handleUpdateMemberRole = async (
    memberId: number,
    role: GroupMemberRole,
  ) => {
    if (!selectedGroup) return;

    setError(null);

    try {
      setMemberActionId(memberId);
      const updatedGroup = await groupApi.updateMemberRole(
        selectedGroup.id,
        memberId,
        role,
      );
      handleGroupUpdated(updatedGroup);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Unable to update member role right now.";
      setError(msg);
    } finally {
      setMemberActionId(null);
    }
  };

  const handleRemoveMember = async (memberId: number) => {
    if (!selectedGroup) return;

    setError(null);

    try {
      setMemberActionId(memberId);
      const updatedGroup = await groupApi.removeMember(selectedGroup.id, memberId);
      handleGroupUpdated(updatedGroup);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Unable to remove member right now.";
      setError(msg);
    } finally {
      setMemberActionId(null);
    }
  };

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
      <section className="flex flex-col gap-4 text-left sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1 text-left">
          <h1 className="text-3xl font-bold tracking-tight">Groups</h1>
          <p className="text-muted-foreground">
            Create a group within your enrolled class and manage your current
            group memberships.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>Create Group</Button>
      </section>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Group</DialogTitle>
            <DialogDescription>
              Enter the basic group information to create a new group.
            </DialogDescription>
          </DialogHeader>
          <CreateGroupForm
            classes={classes}
            onCancel={() => setCreateOpen(false)}
            onCreated={(group) => {
              setGroups((current) => [group, ...current]);
              setCreateOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={addMemberOpen}
        onOpenChange={(open) => {
          setAddMemberOpen(open);
          if (!open) {
            setAddMemberError(null);
            setSelectedMemberId("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Member</DialogTitle>
            <DialogDescription>
              Select an eligible classmate to add to this group.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Member</p>
              <Select
                value={selectedMemberId}
                onValueChange={setSelectedMemberId}
                disabled={eligibleMembersLoading || eligibleMembers.length === 0}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      eligibleMembersLoading
                        ? "Loading eligible members..."
                        : "Select eligible member"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {eligibleMembers.map((member) => (
                    <SelectItem key={member.id} value={String(member.id)}>
                      {member.firstname} {member.lastname} ({member.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {!eligibleMembersLoading && eligibleMembers.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No eligible members are available for this group.
              </p>
            )}

            {addMemberError && (
              <p className="text-sm text-destructive">{addMemberError}</p>
            )}

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddMemberOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleAddMember}
                disabled={
                  addingMember || !selectedMemberId || eligibleMembers.length === 0
                }
              >
                {addingMember ? "Adding..." : "Add Member"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Separator />

      {selectedGroup ? (
        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1 text-left">
              <h2 className="text-xl font-semibold">{selectedGroup.groupName}</h2>
              <p className="text-sm text-muted-foreground">
                View the group details and current members.
              </p>
            </div>
            <Button variant="outline" onClick={() => setSelectedGroup(null)}>
              Back To My Groups
            </Button>
          </div>

          <GroupDetailsCard group={selectedGroup} />
          <GroupMembersTable
            group={selectedGroup}
            onAddMember={isSelectedGroupLeader ? handleOpenAddMember : undefined}
            canManageMembers={isSelectedGroupLeader}
            onAssignLeader={(memberId) => handleUpdateMemberRole(memberId, "LEADER")}
            onRemoveMember={handleRemoveMember}
            actionLoadingMemberId={memberActionId}
          />
        </section>
      ) : (
        <section className="space-y-4">
          <div className="space-y-1 text-left">
            <h2 className="text-xl font-semibold">My Groups</h2>
            <p className="text-sm text-muted-foreground">
              Click a group card to view its details and members.
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
                <GroupCard
                  key={group.id}
                  group={group}
                  onSelect={setSelectedGroup}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
