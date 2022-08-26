import { Link } from '@solidjs/router';
import type { Component } from 'solid-js';

const Intro: Component = () => {
  return (
    <div class="bg-white min-h-screen flex items-center">
      <div class="max-w-7xl mx-auto text-center py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <h2 class="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Random Coffee Pals
        </h2>
        <p class="text-xl mt-4">A tool to organise online coffee breaks with your team</p>
        <div class="mt-8 flex justify-center">
          <div class="inline-flex rounded-md shadow">
            <Link
              href="/login"
              class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded text-white bg-yellow-700 hover:bg-yellow-800"
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
