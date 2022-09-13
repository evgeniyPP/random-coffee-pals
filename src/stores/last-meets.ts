import { createSignal } from 'solid-js';
import { showErrorNotification } from '../components/Notification';
import { BreakId, Meet, MemberId } from '../models';
import { supabase } from '../utils/api';
import { members } from './members';

const [lastMeets, setLastMeets] = createSignal<Record<string, Meet[]>>({});

export async function getLastMeets(breakId: BreakId | null, memberId: MemberId): Promise<Meet[]> {
  const cacheId = `${breakId}_${memberId}`;

  if (breakId && Object.hasOwn(lastMeets(), cacheId)) {
    return lastMeets()[cacheId];
  }

  const maxPairNum = Math.ceil((members() ?? []).length / 2);
  const threshold = maxPairNum - 1;

  if (!threshold) {
    return [];
  }

  const { data, error } = await supabase
    .from<Meet>('meets')
    .select('id, member_1, member_2')
    .or(`member_1.eq.${memberId}, member_2.eq.${memberId}`)
    .order('id', { ascending: false })
    .limit(threshold);

  if (error) {
    console.error(error);
    showErrorNotification();
    return [];
  }

  if (breakId) {
    setLastMeets(prev => ({ ...prev, [cacheId]: data }));
  }

  return data;
}
