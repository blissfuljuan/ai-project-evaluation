import type { Group } from "@/types/group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GroupCardProps {
  group: Group;
}

export function GroupCard({ group }: GroupCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{group.groupName}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {group.courseClassCode} - {group.courseClassTitle}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <p className="text-sm font-medium">Members</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {group.members.map((member) => (
              <li key={member.id}>
                {member.firstname} {member.lastname} ({member.email})
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
