import { createSignal } from 'solid-js';
import { FetchStatus, Member } from '../models';
import { supabase } from '../utils/api';
import { setIsLoading } from './loading';

export const [members, setMembers] = createSignal<Member[]>([]);
const [status, setStatus] = createSignal<FetchStatus>('empty');

export async function getMembers(options?: { refetch: boolean }) {
  if (status() !== 'empty' && options?.refetch !== true) {
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
    .from<Member>('members')
    .select('id, name, contact, is_active')
    .eq('user_id', user.id)
    .order('is_active', { ascending: false })
    .order('name');

  if (error) {
    setStatus('empty');
    setIsLoading(false);
    console.error(error);
    return { success: false, error, status };
  }

  setMembers(data);
  setStatus('fetched');
  setIsLoading(false);

  return { success: true, isFetched: true };
}
