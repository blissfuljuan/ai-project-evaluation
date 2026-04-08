import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Group } from "@/types/group";

interface TeacherGroupsTableProps {
  groups: Group[];
  onViewDetails: (group: Group) => void;
}

export function TeacherGroupsTable({
  groups,
  onViewDetails,
}: TeacherGroupsTableProps) {
  return (
    <Card>
      <CardHeader className="justify-items-start text-left">
        <CardTitle>Class Groups</CardTitle>
      </CardHeader>
      <CardContent>
        {groups.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No groups have been created under your classes yet.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="border-b">
                  <th className="w-16 px-4 py-3 text-left font-medium">#</th>
                  <th className="px-4 py-3 text-left font-medium">Group Name</th>
                  <th className="px-4 py-3 text-left font-medium">Leader</th>
                  <th className="px-4 py-3 text-left font-medium">Class</th>
                  <th className="px-4 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {groups.map((group, index) => (
                  <tr key={group.id} className="border-b last:border-b-0">
                    <td className="px-4 py-3 text-muted-foreground">{index + 1}</td>
                    <td className="px-4 py-3 font-medium">{group.groupName}</td>
                    <td className="px-4 py-3">
                      {group.groupLeader
                        ? `${group.groupLeader.lastname}, ${group.groupLeader.firstname}`
                        : "Not assigned"}
                    </td>
                    <td className="px-4 py-3">
                      {group.courseClassCode} - {group.courseClassTitle}
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onViewDetails(group)}
                      >
                        View Details
                      </Button>
                    </td>
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
