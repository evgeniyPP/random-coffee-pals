import { useParams } from '@solidjs/router';
import { Component, createResource, For, onMount, Show } from 'solid-js';
import html2canvas from 'html2canvas';
import { showErrorNotification } from '../components/Notification';
import Layout from '../Layout';
import { Break as IBreak, BreakId } from '../models';
import { setIsLoading } from '../stores/loading';
import { getMeets, meets } from '../stores/meets';
import { supabase } from '../utils/api';
import { THEME } from '../utils/env';
import { t } from '../utils/text';
import { downloadFile } from '../utils/download-file';
import { getRooms, rooms } from '../stores/rooms';

const Break: Component = () => {
  const params = useParams();
  const breakId: BreakId = params.id;

  const [breakData] = createResource(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from<IBreak>('breaks')
      .select(`id, ${THEME === 'coffee' ? 'coffee_name' : 'tea_name'}, created_at`)
      .eq('id', breakId)
      .single();

    if (error) {
      console.error(error);
      setIsLoading(false);
      showErrorNotification();
      return;
    }

    setIsLoading(false);
    return data;
  });

  const takeScreenshot = async () => {
    const target = document.getElementById('break-info')!;
    const screenshotBtn = document.getElementById('screenshot-btn')!;
    screenshotBtn.style.opacity = '0';
    const canvas = await html2canvas(target);
    canvas.toBlob(blob => {
      screenshotBtn.style.opacity = 'initial';
      const breakName = breakData()![THEME === 'coffee' ? 'coffee_name' : 'tea_name'];
      const name = `${breakName} ${t('Coffee')} Break`.replace(/\s/g, '_');
      downloadFile(blob!, name, 'png');
    });
  };

  onMount(async () => {
    await getMeets(breakId);
    await getRooms();
  });

  return (
    <Layout>
      <Show when={meets()[breakId] && breakData()}>
        <div
          id="break-info"
          class="bg-white dark:bg-gray-900 max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 flex flex-col"
        >
          <h2 class="text-center text-3xl font-extrabold tracking-tight sm:text-4xl">
            {breakData()![THEME === 'coffee' ? 'coffee_name' : 'tea_name']} {t('Coffee')} Break
          </h2>
          <p class="mt-4 text-center">{new Date(breakData()!.created_at).toLocaleDateString()}</p>

          <div class="mt-8 space-y-4">
            <For each={meets()[breakId]}>
              {({ member_1, member_2 }, index) => (
                <div class="relative shadow-lg rounded-lg bg-white dark:bg-gray-800 sm:grid sm:grid-cols-2">
                  <p class="absolute top-0 left-0 w-full flex justify-center">
                    <span class="bg-white dark:bg-gray-800 py-0.5">{rooms()?.[index()]?.name}</span>
                  </p>
                  <div class="border-b border-gray-100 p-6 text-center sm:border-0 sm:border-r">
                    <p class="text-xl font-bold">{member_1.name}</p>
                    <Show when={member_1.contact}>
                      <p class="text-sm text-gray-500 mt-1">{member_1.contact}</p>
                    </Show>
                  </div>
                  <div class="border-t border-gray-100 p-6 text-center sm:border-0 sm:border-l">
                    <p class="text-xl font-bold">{member_2.name}</p>
                    <Show when={member_2.contact}>
                      <p class="text-sm text-gray-500 mt-1">{member_2.contact}</p>
                    </Show>
                  </div>
                </div>
              )}
            </For>
          </div>

          <button id="screenshot-btn" onClick={takeScreenshot} class="mt-8">
            Take a Screenshot
          </button>
        </div>
      </Show>
    </Layout>
  );
};

export default Break;
