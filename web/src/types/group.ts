import type { UserSummary } from "./user";

export interface Group {
  id: number;
  groupName: string;
  courseClassId: number;
  courseClassCode: string;
  courseClassTitle: string;
  members: UserSummary[];
}

export interface CreateGroupRequest {
  groupName: string;
  courseClassId: number;
  memberUserIds: number[];
}
