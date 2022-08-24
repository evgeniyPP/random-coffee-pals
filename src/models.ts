export interface User {
  id: UserId;
  name: string;
  is_active: boolean;
}

export interface Meet {
  id: number;
  meet_id: number;
  user_1: UserId;
  user_2: UserId;
}

export interface NewMeet {
  user_1: UserId;
  user_2: UserId;
}

export type UserId = number;
