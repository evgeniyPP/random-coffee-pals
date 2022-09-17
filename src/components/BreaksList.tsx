import { For } from 'solid-js';
import type { Component } from 'solid-js';
import { getBreaks, breaks } from '../stores/breaks';
import { Break, BreakId, Meet } from '../models';
import { supabase } from '../utils/api';
import { openModal } from './Modal';
import { isLoading, setIsLoading } from '../stores/loading';
import { showErrorNotification } from './Notification';
import { THEME } from '../utils/env';
import { t } from '../utils/text';

const BreaksList: Component = () => {
  const openDeleteModal = (b: Break) => {
    openModal({
      title: 'Delete this break?',
      content: `Are you sure you want to delete ${
        THEME === 'coffee' ? b.coffee_name : b.tea_name
      } ${t('Coffee')} Break?`,
      type: 'danger',
      action: () => deleteBreak(b.id),
      actionLabel: 'Delete'
    });
  };

  const deleteBreak = async (id: BreakId) => {
    setIsLoading(true);
    const { error: meetsError } = await supabase
      .from<Meet>('meets')
      .delete({ returning: 'minimal' })
      .eq('break_id', id);

    if (meetsError) {
      console.error(meetsError);
      setIsLoading(false);
      showErrorNotification();
      return;
    }

    const { error } = await supabase
      .from<Break>('breaks')
      .delete({ returning: 'minimal' })
      .eq('id', id);

    if (error) {
      console.error(error);
      setIsLoading(false);
      showErrorNotification();
      return;
    }

    await getBreaks({ refetch: true });
    setIsLoading(false);
  };

  return (
    <ul id="breaks-list" role="list" class="divide-y divide-gray-200 sm:pr-2">
      <For each={breaks()}>
        {b => (
          <li class="py-4">
            <div class="flex flex-col sm:flex-row gap-4 items-center space-x-4">
              <div class="flex-1 min-w-0">
                <p class="font-medium">
                  {THEME === 'coffee' ? b.coffee_name : b.tea_name}
                  <span class="block text-xs text-slate-400">
                    {new Date(b.created_at).toLocaleDateString()}
                  </span>
                </p>
              </div>
              <div class="flex gap-1">
                <a
                  href={`/breaks/${b.id}`}
                  class="shadow-sm px-2.5 py-0.5 border border-gray-300 text-sm leading-5 font-medium rounded-full btn-default focus-default"
                  target="_blank"
                >
                  View
                </a>
                <button
                  onClick={() => openDeleteModal(b)}
                  disabled={isLoading()}
                  class="shadow-sm px-2.5 py-0.5 border border-red-300 text-sm leading-5 font-medium rounded-full btn-default dark:border-red-900 focus-default"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        )}
      </For>
    </ul>
  );
};

export default BreaksList;
