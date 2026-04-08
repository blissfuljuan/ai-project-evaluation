import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Group } from "@/types/group";

interface GroupDetailsCardProps {
  group: Group;
}

export function GroupDetailsCard({ group }: GroupDetailsCardProps) {
  return (
    <Card>
      <CardHeader className="justify-items-start text-left">
        <CardTitle>Group Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-left text-sm">
        <p>
          <span className="font-medium">Group Name:</span> {group.groupName}
        </p>
        <p>
          <span className="font-medium">Class:</span> {group.courseClassCode} -{" "}
          {group.courseClassTitle}
        </p>
        <p>
          <span className="font-medium">Group Leader:</span>{" "}
          {group.groupLeader
            ? `${group.groupLeader.lastname}, ${group.groupLeader.firstname}`
            : "Not assigned"}
        </p>
      </CardContent>
    </Card>
  );
}
