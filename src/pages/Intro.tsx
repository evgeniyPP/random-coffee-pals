import { Link } from '@solidjs/router';
import type { Component } from 'solid-js';
import { t } from '../utils/text';

const Intro: Component = () => {
  return (
    <div class="theme-default min-h-screen flex items-center">
      <div class="max-w-7xl mx-auto text-center py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <h2 class="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Random {t('Coffee Pals')}
        </h2>
        <p class="text-xl mt-4">A tool to organise online {t('coffee')} breaks with your team</p>
        <div class="mt-8 flex justify-center">
          <div class="rounded-md shadow">
            <Link
              href="/login"
              class="px-5 py-3 border border-transparent text-base font-medium rounded text-white bg-primary-700 hover:bg-primary-800"
            >
              Get started
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intro;
