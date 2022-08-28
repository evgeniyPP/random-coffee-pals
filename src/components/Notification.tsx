import { Component, createSignal, Match, Show, Switch } from 'solid-js';
import CheckCircleIcon from './icons/CheckCircleIcon';
import ExclamationCircleIcon from './icons/ExclamationCircleIcon';
import InformationCircleIcon from './icons/InformationCircleIcon';
import MarkIcon from './icons/MarkIcon';

export interface NotificationOptions {
  title: string;
  content: string;
  type?: 'default' | 'success' | 'danger';
  time?: number;
}

const [isNotificationOpen, setIsNotificationOpen] = createSignal(false);
const [title, setTitle] = createSignal('');
const [content, setContent] = createSignal('');
const [type, setType] = createSignal<string>();

export function openNotification(options: NotificationOptions) {
  setTitle(options.title);
  setContent(options.content);
  setType(options.type ?? 'default');
  setIsNotificationOpen(true);

  if (options.time) {
    setTimeout(() => closeNotification(), options.time);
  }
}

export function closeNotification() {
  setIsNotificationOpen(false);
  setTitle('');
  setContent('');
  setType();
}

const Notification: Component = () => {
  return (
    <Show when={isNotificationOpen()}>
      <div
        aria-live="assertive"
        class="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start"
      >
        {/* TODO: add transitions */}
        <div class="w-full flex flex-col items-center space-y-4 sm:items-end">
          <div class="max-w-sm w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
            <div class="p-4">
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <Switch>
                    <Match when={type() === 'default'}>
                      <InformationCircleIcon size={6} class="text-primary-600" />
                    </Match>
                    <Match when={type() === 'success'}>
                      <CheckCircleIcon size={6} class="text-green-500" />
                    </Match>
                    <Match when={type() === 'danger'}>
                      <ExclamationCircleIcon size={6} class="text-red-500" />
                    </Match>
                  </Switch>
                </div>
                <div class="ml-3 w-0 flex-1 pt-0.5">
                  <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{title()}</p>
                  <p class="mt-1 text-sm text-gray-500 dark:text-gray-300">{content()}</p>
                </div>
                <div class="ml-4 flex-shrink-0 flex">
                  <button
                    onClick={closeNotification}
                    class="bg-white dark:bg-gray-800 rounded-md inline-flex text-gray-400 hover:text-gray-500 focus-default"
                  >
                    <span class="sr-only">Close</span>
                    <MarkIcon size={5} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Show>
  );
};

export function showErrorNotification(message?: string) {
  openNotification({
    title: 'Error',
    content: message || 'Something went wrong 😱. Try again later',
    type: 'danger',
    time: 4000
  });
}

export default Notification;
