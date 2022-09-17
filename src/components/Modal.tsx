import { Component, createSignal, Show } from 'solid-js';
import { isLoading } from '../stores/loading';

export interface ModalOptions {
  title: string;
  content: string;
  action: () => void;
  actionLabel?: string;
  type?: 'default' | 'success' | 'danger';
}

const colorByType = { default: 'primary', success: 'green', danger: 'red' };

const [isModalOpen, setIsModalOpen] = createSignal(false);
export { isModalOpen };

const [title, setTitle] = createSignal('');
const [content, setContent] = createSignal('');
const [color, setColor] = createSignal(colorByType.default);
const [action, setAction] = createSignal<(() => void) | null>(null);
const [actionLabel, setActionLabel] = createSignal('Confirm');

export function openModal(options: ModalOptions) {
  setTitle(options.title);
  setContent(options.content);
  setAction(() => options.action);
  setActionLabel(options.actionLabel ?? 'Confirm');
  setColor(colorByType[options.type ?? 'default']);
  setIsModalOpen(true);
}

export function closeModal() {
  setIsModalOpen(false);
  setTitle('');
  setContent('');
  setAction(null);
  setActionLabel('');
  setColor(colorByType.default);
}

const Modal: Component = () => {
  return (
    <Show when={isModalOpen()}>
      <div
        class="fixed z-10 inset-0 overflow-y-auto"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          {/* TODO: add transitions */}
          <div
            class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            aria-hidden="true"
          ></div>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>

          <div class="relative inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:text-left">
                  <h3
                    class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100"
                    id="modal-title"
                  >
                    {title()}
                  </h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500 dark:text-gray-300">{content()}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                onClick={() => {
                  const cb = action();
                  if (cb) cb();
                  closeModal();
                }}
                disabled={isLoading()}
                type="button"
                class={`w-full rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus-default sm:ml-3 sm:w-auto sm:text-sm`}
                classList={{
                  'bg-primary-600': color() === 'primary',
                  'bg-green-600': color() === 'green',
                  'bg-red-600': color() === 'red',
                  'hover:bg-primary-700`': color() === 'primary',
                  'hover:bg-green-700`': color() === 'green',
                  'hover:bg-red-700`': color() === 'red'
                }}
              >
                {actionLabel()}
              </button>
              <button
                onClick={closeModal}
                type="button"
                class="mt-3 w-full rounded-md border border-gray-300 dark:border-gray-500 shadow-sm px-4 py-2 btn-default text-base font-medium focus-default sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </Show>
  );
};

export default Modal;
