import { createSignal } from 'solid-js';
import { BreakId, Member, MemberId, NewMeet } from '../models';
import { getLastMeets } from '../stores/last-meets';
import { members } from '../stores/members';

const [currentBreakId, setCurrentBreakId] = createSignal<BreakId | null>(null);

export async function createMeets(breakId: BreakId): Promise<NewMeet[]> {
  setCurrentBreakId(breakId);

  const activeMembers = members().filter(m => m.is_active);
  let membersToPair = shuffleArray(activeMembers);

  let meets: NewMeet[] = [];

  while (membersToPair.length > 1) {
    const excludedUsers = meets.map(p => [p.member_1, p.member_2]).flat();
    const pair = await getPair(membersToPair[0], activeMembers, excludedUsers);

    if (!pair) {
      meets = [];
      membersToPair = shuffleArray(activeMembers);
      continue;
    }

    const [{ id: member_1 }, { id: member_2 }] = pair;
    meets.push({ break_id: breakId, member_1, member_2 });
    membersToPair = membersToPair.filter(u => ![member_1, member_2].includes(u.id));
  }

  return meets;
}

async function getPair(
  member: Member,
  members: Member[],
  exclude: MemberId[] = []
): Promise<[Member, Member] | null> {
  const randomMember = getRandomMember(members, [member.id, ...exclude]);
  const lastMeetsUsers = await getLastMeetsMembers(member.id);

  if (!randomMember) {
    return null;
  }

  if (lastMeetsUsers.includes(randomMember.id)) {
    return getPair(member, members, [...exclude, randomMember.id]);
  }

  return [member, randomMember];
}

function getRandomMember(members: Member[], exclude: MemberId[] = []): Member {
  return getRandomArrayItem(members.filter(u => !exclude.includes(u.id)));
}

async function getLastMeetsMembers(memberId: MemberId): Promise<MemberId[]> {
  const lastMeets = await getLastMeets(currentBreakId(), memberId);
  return lastMeets.map(m => (m.member_1 === memberId ? m.member_2 : m.member_1));
}

function shuffleArray<T = any>(initialArray: T[]): T[] {
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
  return arr[Math.floor(Math.random() * arr.length)];
}
