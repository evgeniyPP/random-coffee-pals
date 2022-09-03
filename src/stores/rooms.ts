import { createSignal } from 'solid-js';
import { FetchStatus, Room } from '../models';
import { supabase } from '../utils/api';
import { setIsLoading } from './loading';

export const [rooms, setRooms] = createSignal<Room[]>();
const [status, setStatus] = createSignal<FetchStatus>('empty');

export async function getRooms(options?: { refetch: boolean }) {
  if (status() !== 'empty' && options?.refetch !== true) {
    return { success: true, status: status() };
  }

  setStatus('fetching');
  setIsLoading(true);
  const user = supabase.auth.user();

  if (!user?.id) {
    setStatus('empty');
    setIsLoading(false);
    throw new Error('Try to get rooms, but no user');
  }

  const { data, error } = await supabase
    .from<Room>('rooms')
    .select('id, name')
    .eq('user_id', user.id)
    .order('id');

  if (error) {
    setStatus('empty');
    setIsLoading(false);
    console.error(error);
    return { success: false, error, status };
  }

  setRooms(data);
  setStatus('fetched');
  setIsLoading(false);

  return { success: true, isFetched: true };
}
