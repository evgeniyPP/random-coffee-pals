export type UserId = string;
export type MemberId = number;
export type BreakId = number;
export type MeetId = number;

export interface User {
  id: UserId;
  email: string;
  password: string;
  created_at: string;
}

export interface NewUser {
  email: string;
  password: string;
}

export interface Member {
  id: MemberId;
  user_id: UserId;
  name: string;
  is_active: boolean;
  created_at: string;
}

export interface NewMember {
  user_id: UserId;
  name: string;
  is_active?: boolean;
}

export interface Break {
  id: BreakId;
  user_id: UserId;
  created_at: string;
}

export interface NewBreak {
  user_id: UserId;
}

export interface Meet {
  id: MeetId;
  break_id: BreakId;
  member_1: MemberId;
  member_2: MemberId;
  created_at: string;
}

export interface NewMeet {
  break_id: BreakId;
  member_1: MemberId;
  member_2: MemberId;
}
