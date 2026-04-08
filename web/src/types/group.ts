import type { UserSummary } from "./user";

export type GroupMemberRole = "LEADER" | "MEMBER";

export interface GroupMember {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: GroupMemberRole;
}

export interface Group {
  id: number;
  groupName: string;
  courseClassId: number;
  courseClassCode: string;
  courseClassTitle: string;
  groupLeader: UserSummary | null;
  members: GroupMember[];
}

export interface CreateGroupRequest {
  groupName: string;
  courseClassId: number;
  memberUserIds: number[];
}
