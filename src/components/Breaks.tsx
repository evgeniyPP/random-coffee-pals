import { Component, createEffect, createSignal, onMount, Show } from 'solid-js';
import { setIsScrollable } from '../App';
import { getBreaks } from '../stores/breaks';
import { closeOnEscapeKeyDown } from '../utils/close-on-escape';
import BreaksList from './BreaksList';
import MarkIcon from './icons/MarkIcon';

export const [isBreaksOpen, setIsBreaksOpen] = createSignal(false);

const Breaks: Component = () => {
  onMount(async () => {
    await getBreaks();
  });

  createEffect(() => {
    setIsScrollable(!isBreaksOpen());
  });

  closeOnEscapeKeyDown(isBreaksOpen, setIsBreaksOpen);

  return (
    <Show when={isBreaksOpen()}>
      <div class="relative z-10" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <div class="fixed inset-0 overflow-hidden">
          <div class="absolute inset-0 overflow-hidden">
            <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <div class="pointer-events-auto relative w-screen max-w-md">
                <div class="absolute top-0 left-0 -ml-8 flex pt-4 pr-2 sm:-ml-10 sm:pr-4">
                  <button
                    onClick={() => setIsBreaksOpen(false)}
                    type="button"
                    class="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    <span class="sr-only">Close panel</span>
                    <MarkIcon size={6} />
                  </button>
                </div>

                <div class="flex h-full flex-col overflow-y-auto theme-default py-8 shadow-xl">
                  <div class="px-4 sm:px-6">
                    <h2 class="text-2xl font-bold" id="slide-over-title">
                      Breaks
                    </h2>
                  </div>
                  <div class="relative mt-6 flex-1 px-4 sm:px-6">
                    <BreaksList />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Show>
  );
};

export default Breaks;
