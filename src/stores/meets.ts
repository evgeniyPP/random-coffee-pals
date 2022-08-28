import { createSignal } from 'solid-js';
import { BreakId, FetchStatus, MeetWithNames } from '../models';
import { supabase } from '../utils/api';
import { setIsLoading } from './loading';

export const [meets, setMeets] = createSignal<Record<BreakId, MeetWithNames[]>>({});
const [status, setStatus] = createSignal<FetchStatus>('empty');

export async function getMeets(breakId: BreakId, options?: { refetch: boolean }) {
  if (status() !== 'empty' && Object.hasOwn(meets(), breakId) && options?.refetch !== true) {
    return { success: true, status: status() };
  }

  setStatus('fetching');
  setIsLoading(true);

  const { data, error } = await supabase
    .from<MeetWithNames>('meets')
    .select('break_id, member_1 (name, contact), member_2 (name, contact)')
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
