import { useNavigate } from '@solidjs/router';
import type { Component } from 'solid-js';
import { supabase } from '../utils/api';

const Header: Component = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      // TODO: handle errors
      return;
    }

    navigate('/login', { replace: true });
  };

  return (
    <>
      <header class="bg-yellow-800">
        <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
          <div class="w-full py-6 flex items-center justify-between border-b border-yellow-500 lg:border-none">
            <div class="flex items-center">
              <h1 class="text-lg font-medium text-white">Random Coffee Pals</h1>
            </div>
            <div class="ml-10 space-x-4">
              <button
                onClick={handleLogout}
                class="inline-block bg-white py-2 px-4 border border-transparent rounded-md text-base font-medium text-yellow-800 hover:bg-yellow-50"
              >
                Log out
              </button>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
