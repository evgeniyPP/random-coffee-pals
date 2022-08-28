import { Component, createSignal, Match, Show, Switch } from 'solid-js';

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
          <div class="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
            <div class="p-4">
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <Switch>
                    <Match when={type() === 'default'}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        class="w-6 h-6 text-yellow-600"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                        />
                      </svg>
                    </Match>
                    <Match when={type() === 'success'}>
                      <svg
                        class="h-6 w-6 text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </Match>
                    <Match when={type() === 'danger'}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        class="w-6 h-6 text-red-500"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                        />
                      </svg>
                    </Match>
                  </Switch>
                </div>
                <div class="ml-3 w-0 flex-1 pt-0.5">
                  <p class="text-sm font-medium text-gray-900">{title()}</p>
                  <p class="mt-1 text-sm text-gray-500">{content()}</p>
                </div>
                <div class="ml-4 flex-shrink-0 flex">
                  <button
                    onClick={closeNotification}
                    class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus-default"
                  >
                    <span class="sr-only">Close</span>
                    <svg
                      class="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      />
                    </svg>
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

export function showErrorNotification() {
  openNotification({
    title: 'Error',
    content: 'Something went wrong 😱. Try again later',
    type: 'danger',
    time: 4000
  });
}

export default Notification;
