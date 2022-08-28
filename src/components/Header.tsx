import { Link, useNavigate } from '@solidjs/router';
import { Component, Match, Show, Switch } from 'solid-js';
import { isDarkMode, setDarkMode } from '../stores/dark-mode';
import { isLoading, setIsLoading } from '../stores/loading';
import { supabase } from '../utils/api';
import { COFFEE_URL, TEA_URL, THEME } from '../utils/env';
import { t } from '../utils/text';
import MoonIcon from './icons/MoonIcon';
import SunIcon from './icons/SunIcon';
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
      <header class="bg-primary-800">
        <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
          <div class="w-full py-6 flex flex-col gap-4 sm:flex-row items-center justify-between border-b border-primary-500 lg:border-none">
            <Link href="/" class="flex items-center">
              <h1 class="py-2 text-lg font-bold text-white">Random {t('Coffee Pals')}</h1>
            </Link>
            <div class="sm:ml-10 space-x-2 flex items-center">
              <Switch>
                <Match when={isDarkMode()}>
                  <button onClick={() => setDarkMode(false)}>
                    <SunIcon size={6} strokeWidth={1.5} class="text-white mr-4" />
                  </button>
                </Match>
                <Match when={!isDarkMode()}>
                  <button onClick={() => setDarkMode(true)}>
                    <MoonIcon size={6} strokeWidth={1.5} class="text-white mr-4" />
                  </button>
                </Match>
              </Switch>

              <Switch>
                <Match when={THEME === 'coffee'}>
                  <a
                    href={TEA_URL}
                    class="inline-block bg-white py-2 px-4 border border-transparent rounded-md text-base font-medium text-green-700 hover:bg-green-50"
                  >
                    I prefer tea
                  </a>
                </Match>
                <Match when={THEME === 'tea'}>
                  <a
                    href={COFFEE_URL}
                    class="inline-block bg-white py-2 px-4 border border-transparent rounded-md text-base font-medium text-yellow-800 hover:bg-yellow-50"
                  >
                    I prefer coffee
                  </a>
                </Match>
              </Switch>

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
