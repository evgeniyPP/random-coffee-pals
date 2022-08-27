import { createSignal } from 'solid-js';
import { BreakId, Meet, MemberId } from '../models';
import { supabase } from '../utils/api';
import { members } from './members';

const [lastMeets, setLastMeets] = createSignal<Record<string, Meet[]>>({});

export async function getLastMeets(breakId: BreakId | null, memberId: MemberId): Promise<Meet[]> {
  const cacheId = `${breakId}_${memberId}`;

  if (breakId && Object.hasOwn(lastMeets(), cacheId)) {
    return lastMeets()[cacheId];
  }

  const maxPairNum = Math.ceil(members().length / 2);
  const threshold = maxPairNum > 3 ? 3 : maxPairNum - 1;

  const { data, error } = await supabase
    .from<Meet>('meets')
    .select('id, member_1, member_2')
    .or(`member_1.eq.${memberId}, member_2.eq.${memberId}`)
    .order('id', { ascending: false })
    .limit(threshold);

  if (error) {
    // TODO: handle errors
    console.error(error);
    return [];
  }

  if (breakId) {
    setLastMeets(prev => ({ ...prev, [cacheId]: data }));
  }

  return data;
}