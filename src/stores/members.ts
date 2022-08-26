import { createSignal } from 'solid-js';
import { FetchStatus, Member } from '../models';
import { supabase } from '../utils/api';

export const [members, setMembers] = createSignal<Member[]>([]);
const [status, setStatus] = createSignal<FetchStatus>('empty');

export async function getMembers(options?: { refetch: boolean }) {
  if (status() !== 'empty' && options?.refetch !== true) {
    return { success: true, status: status() };
  }

  setStatus('fetching');
  const user = supabase.auth.user();

  if (!user?.id) {
    setStatus('empty');
    throw new Error('Try to get members, but no user');
  }

  const { data, error } = await supabase
    .from('members')
    .select('id, name, is_active')
    .eq('user_id', user.id)
    .order('is_active', { ascending: false })
    .order('name');

  if (error) {
    setStatus('empty');
    console.error(error);
    return { success: false, error, status };
  }

  setMembers(data);
  setStatus('fetched');

  return { success: true, isFetched: true };
}
