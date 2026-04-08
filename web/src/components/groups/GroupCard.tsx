import type { Group } from "@/types/group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GroupCardProps {
  group: Group;
  onSelect?: (group: Group) => void;
}

export function GroupCard({ group, onSelect }: GroupCardProps) {
  return (
    <Card
      className={`text-left ${onSelect ? "cursor-pointer transition-colors hover:bg-muted/40" : ""}`}
      onClick={onSelect ? () => onSelect(group) : undefined}
    >
      <CardHeader className="justify-items-start text-left">
        <CardTitle>{group.groupName}</CardTitle>
      </CardHeader>
      <CardContent className="text-left">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Group Leader:</span>{" "}
          {group.groupLeader
            ? `${group.groupLeader.firstname} ${group.groupLeader.lastname}`
            : "Not assigned"}
        </p>
      </CardContent>
    </Card>
  );
}
