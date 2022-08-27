import { createSignal } from 'solid-js';
import { BreakId, FetchStatus, Meet, MemberId } from '../models';
import { supabase } from '../utils/api';
import { setIsLoading } from './loading';
import { members } from './members';

export const [meets, setMeets] = createSignal<Record<BreakId, Meet[]>>({});
const [status, setStatus] = createSignal<FetchStatus>('empty');

export async function getMeets(breakId: BreakId, options?: { refetch: boolean }) {
  if (status() !== 'empty' && Object.hasOwn(meets(), breakId) && options?.refetch !== true) {
    return { success: true, status: status() };
  }

  setStatus('fetching');
  setIsLoading(true);
  const user = supabase.auth.user();

  if (!user?.id) {
    setStatus('empty');
    setIsLoading(false);
    throw new Error('Try to get members, but no user');
  }

  const { data, error } = await supabase
    .from<Meet>('meets')
    .select('member_1 (name), member_2 (name)')
    .eq('break_id', breakId);

  if (error) {
    setStatus('empty');
    setIsLoading(false);
    console.error(error);
    return { success: false, error, status };
  }

  setMeets(prev => ({ ...prev, [breakId]: data }));
  setStatus('fetched');
  setIsLoading(false);

  return { success: true, isFetched: true };
}

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
