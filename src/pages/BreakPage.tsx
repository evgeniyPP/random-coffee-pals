import { useParams } from '@solidjs/router';
import { Component, createResource, For, onMount, Show } from 'solid-js';
import Header from '../components/Header';
import Modal from '../components/Modal';
import { Break as IBreak, BreakId } from '../models';
import { getMeets, meets } from '../stores/meets';
import { supabase } from '../utils/api';

const Break: Component = () => {
  const params = useParams();
  const breakId: BreakId = params.id;

  const [breakData] = createResource(async () => {
    const { data, error } = await supabase
      .from<IBreak>('breaks')
      .select('id, name, created_at')
      .eq('id', breakId)
      .single();

    if (error) {
      // TODO: handle errors
      console.error(error);
      return;
    }

    return data;
  });

  onMount(async () => {
    await getMeets(breakId);
  });

  return (
    <>
      <Header />
      <div class="bg-white min-h-main">
        <Show when={meets()[breakId] && breakData()}>
          <div class="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 flex flex-col">
            <h2 class="text-center text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              {breakData()!.name} Coffee Break
            </h2>
            <p class="mt-4 text-center">{new Date(breakData()!.created_at).toLocaleDateString()}</p>

            <div class="mt-8 space-y-4">
              <For each={meets()[breakId]}>
                {({ member_1, member_2 }) => (
                  <div class="shadow-lg rounded-lg bg-white sm:grid sm:grid-cols-2">
                    <div class="border-b border-gray-100 p-6 text-center sm:border-0 sm:border-r">
                      <span class="text-xl font-bold">{member_1.name}</span>
                    </div>
                    <div class="border-t border-gray-100 p-6 text-center sm:border-0 sm:border-l">
                      <span class="text-xl font-bold">{member_2.name}</span>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </div>
        </Show>
      </div>

      <Modal />
    </>
  );
};

export default Break;
