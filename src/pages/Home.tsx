import { Component } from 'solid-js';
import Header from '../components/Header';
import MembersList from '../components/MembersList';
import Modal from '../components/Modal';
import { supabase } from '../utils/api';
import Intro from './Intro';

const Home: Component = () => {
  const user = supabase.auth.user();

  if (!user?.id) {
    return <Intro />;
  }

  return (
    <>
      <Header />
      <div class="bg-white min-h-screen">
        <div class="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <h2 class="text-center text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Your Teammates
          </h2>

          <div class="mt-8">
            <MembersList />
          </div>

          <div class="mt-8 flex items-center space-x-4">
            <div class="flex-1">
              <label for="name" class="block text-sm font-medium text-gray-700">
                Add a new teammate
              </label>
              <div class="mt-1">
                <input
                  type="text"
                  name="name"
                  id="name"
                  class="shadow-sm block w-full sm:text-sm border-gray-300 rounded-md focus-default"
                  placeholder="Teammate name"
                />
              </div>
            </div>
            <button class="mt-6 inline-flex items-center shadow-sm px-4 py-1.5 border border-gray-300 leading-5 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 focus-default">
              Add
            </button>
          </div>
        </div>
      </div>

      <Modal />
    </>
  );
};

export default Home;
