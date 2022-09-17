import { Link, useLocation, useNavigate } from '@solidjs/router';
import { Component, Show } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { isDarkMode, setDarkMode } from '../stores/dark-mode';
import { isLoading, setIsLoading } from '../stores/loading';
import { supabase } from '../utils/api';
import { COFFEE_URL, TEA_URL, THEME } from '../utils/env';
import { t } from '../utils/text';
import MoonIcon from './icons/MoonIcon';
import SunIcon from './icons/SunIcon';
import { showErrorNotification } from './Notification';
import { setIsRoomsOpen } from './Rooms';
import { setIsBreaksOpen } from './Breaks';

const Header: Component = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
      <header class="bg-primary-800">
        <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
          <div class="w-full py-6 flex flex-col gap-4 sm:flex-row items-center justify-between border-b border-primary-500 lg:border-none">
            <Link href="/" class="flex items-center">
              <h1 class="py-2 text-lg font-bold text-white">Random {t('Coffee Pals')}</h1>
            </Link>
            <div class="sm:ml-10 space-x-2 flex flex-wrap justify-center items-center gap-y-2">
              <button onClick={() => setDarkMode(!isDarkMode())} class="mr-4">
                <Dynamic
                  component={isDarkMode() ? SunIcon : MoonIcon}
                  size={6}
                  strokeWidth={1.5}
                  class="text-white"
                />
              </button>

              <a
                href={`${THEME === 'coffee' ? TEA_URL : COFFEE_URL}${location.pathname}`}
                class="inline-block bg-white py-2 px-4 border border-transparent rounded-md text-base font-medium"
                classList={{
                  'text-green-700 hover:bg-green-50': THEME === 'coffee',
                  'text-yellow-800 hover:bg-yellow-50': THEME === 'tea'
                }}
              >
                I prefer {THEME === 'coffee' ? 'tea' : 'coffee'}
              </a>

              <Show when={user?.id && location.pathname === '/'}>
                <button
                  onClick={() => setIsRoomsOpen(true)}
                  disabled={isLoading()}
                  class="inline-block bg-white py-2 px-4 border border-transparent rounded-md text-base font-medium text-primary-800 hover:bg-primary-50"
                >
                  Rooms
                </button>
                <button
                  onClick={() => setIsBreaksOpen(true)}
                  disabled={isLoading()}
                  class="inline-block bg-white py-2 px-4 border border-transparent rounded-md text-base font-medium text-primary-800 hover:bg-primary-50"
                >
                  Breaks
                </button>
              </Show>
              <Show when={user?.id}>
                <button
                  onClick={handleLogout}
                  disabled={isLoading()}
                  class="inline-block bg-white py-2 px-4 border border-transparent rounded-md text-base font-medium text-primary-800 hover:bg-primary-50"
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
