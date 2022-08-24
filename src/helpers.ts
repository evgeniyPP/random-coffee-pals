import { User, UserId } from './models';

const THRESHOLD = 3; // TODO: get from api

export function getRandomUser(users: User[], exclude: UserId[] = []): User {
  return getRandomArrayItem(users.filter(u => !exclude.includes(u.id)));
}

// export function getLastMeetsUsers(userId: UserId): UserId[] {
//   const totalPals = USERS_TABLE.length - 1;
//   const meetsCount = totalPals - 1 > THRESHOLD ? THRESHOLD : totalPals - 1;
//   const lastMeets = MEETS_TABLE.slice(-meetsCount).filter(
//     m => m.user_1 === userId || m.user_2 === userId
//   );
//   return lastMeets.map(m => (m.user_1 === userId ? m.user_2 : m.user_1));
// }

export function shuffle<T = any>(initialArray: T[]): T[] {
  const arr = [...initialArray];

  let currentIdx = arr.length;
  let randomIdx: number;

  while (currentIdx !== 0) {
    randomIdx = Math.floor(Math.random() * currentIdx);
    currentIdx--;
    [arr[currentIdx], arr[randomIdx]] = [arr[randomIdx], arr[currentIdx]];
  }

  return arr;
}

export function getRandomArrayItem<T = any>(arr: T[]): T {
  return arr[getRandomArrayIndex(arr)];
}

export function getRandomArrayIndex(arr: any[]): number {
  return Math.floor(Math.random() * arr.length);
}
