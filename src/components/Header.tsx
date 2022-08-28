import { Link, useNavigate } from '@solidjs/router';
import { Component, Show } from 'solid-js';
import { isLoading, setIsLoading } from '../stores/loading';
import { supabase } from '../utils/api';
import { showErrorNotification } from './Notification';

const Header: Component = () => {
  const navigate = useNavigate();
  const user = supabase.auth.user();

  const handleLogout = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error);
      setIsLoading(false);
      showErrorNotification();
      return;
    }

    navigate('/login', { replace: true });
    setIsLoading(false);
  };

  return (
    <>
      <header class="bg-yellow-800">
        <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
          <div class="w-full py-6 flex flex-col gap-4 sm:flex-row items-center justify-between border-b border-yellow-500 lg:border-none">
            <Link href="/" class="flex items-center">
              <h1 class="py-2 text-lg font-bold text-white">Random Coffee Pals</h1>
            </Link>
            <div class="sm:ml-10 space-x-4">
              <Show when={user?.id}>
                <button
                  onClick={handleLogout}
                  disabled={isLoading()}
                  class="inline-block bg-white py-2 px-4 border border-transparent rounded-md text-base font-medium text-yellow-800 hover:bg-yellow-50"
                >
                  Log out
                </button>
              </Show>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
