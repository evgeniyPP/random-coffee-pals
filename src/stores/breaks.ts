import { createSignal } from 'solid-js';
import { Break, FetchStatus } from '../models';
import { supabase } from '../utils/api';
import { setIsLoading } from './loading';

export const [breaks, setBreaks] = createSignal<Break[]>();
const [status, setStatus] = createSignal<FetchStatus>('empty');

export async function getBreaks(options?: { refetch: boolean }) {
  if (status() !== 'empty' && options?.refetch !== true) {
    return { success: true, status: status() };
  }

  setStatus('fetching');
  setIsLoading(true);
  const user = supabase.auth.user();

  if (!user?.id) {
    setStatus('empty');
    setIsLoading(false);
    throw new Error('Try to get breaks, but no user');
  }

  const { data, error } = await supabase
    .from<Break>('breaks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    setStatus('empty');
    setIsLoading(false);
    console.error(error);
    return { success: false, error, status };
  }

  setBreaks(data);
  setStatus('fetched');
  setIsLoading(false);

  return { success: true, isFetched: true };
}
