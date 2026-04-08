import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Group } from "@/types/group";

interface GroupMembersTableProps {
  group: Group;
  onAddMember?: () => void;
  canManageMembers?: boolean;
  onAssignLeader?: (memberId: number) => void;
  onRemoveMember?: (memberId: number) => void;
  actionLoadingMemberId?: number | null;
}

export function GroupMembersTable({
  group,
  onAddMember,
  canManageMembers = false,
  onAssignLeader,
  onRemoveMember,
  actionLoadingMemberId = null,
}: GroupMembersTableProps) {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle>Group Members</CardTitle>
        {onAddMember && (
          <Button onClick={onAddMember}>Add Member</Button>
        )}
      </CardHeader>
      <CardContent>
        {group.members.length === 0 ? (
          <p className="text-sm text-muted-foreground">No group members found.</p>
        ) : (
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="border-b">
                  <th className="w-16 px-4 py-3 text-left font-medium">#</th>
                  <th className="px-4 py-3 text-left font-medium">Lastname</th>
                  <th className="px-4 py-3 text-left font-medium">Firstname</th>
                  <th className="px-4 py-3 text-left font-medium">Email</th>
                  <th className="px-4 py-3 text-left font-medium">Role</th>
                  {canManageMembers && (
                    <th className="px-4 py-3 text-left font-medium">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {group.members.map((member, index) => (
                  <tr key={member.id} className="border-b last:border-b-0">
                    <td className="px-4 py-3 text-muted-foreground">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3">{member.lastname}</td>
                    <td className="px-4 py-3">{member.firstname}</td>
                    <td className="px-4 py-3">{member.email}</td>
                    <td className="px-4 py-3">{member.role === "LEADER" ? "Leader" : "Member"}</td>
                    {canManageMembers && (
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          {member.role !== "LEADER" && onAssignLeader && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onAssignLeader(member.id)}
                              disabled={actionLoadingMemberId === member.id}
                            >
                              {actionLoadingMemberId === member.id ? "Saving..." : "Assign Leader"}
                            </Button>
                          )}
                          {member.role !== "LEADER" && onRemoveMember && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => onRemoveMember(member.id)}
                              disabled={actionLoadingMemberId === member.id}
                            >
                              {actionLoadingMemberId === member.id ? "Removing..." : "Remove"}
                            </Button>
                          )}
                          {member.role === "LEADER" && (
                            <span className="text-sm text-muted-foreground">Current leader</span>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
