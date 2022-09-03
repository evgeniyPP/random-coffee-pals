import { Route, Routes } from '@solidjs/router';
import { Component, createEffect, createSignal, lazy, onMount } from 'solid-js';
import Modal from './components/Modal';
import Notification from './components/Notification';
import { setTheme } from './stores/dark-mode';
import { THEME } from './utils/env';
import { setFavicon } from './utils/favicon';
import teaFavicon from './assets/favicon-tea.ico';

const BreakPage = lazy(() => import('./pages/BreakPage'));
const SignIn = lazy(() => import('./pages/SignIn'));
const SignUp = lazy(() => import('./pages/SignUp'));
const Home = lazy(() => import('./pages/Home'));

export const [isScrollable, setIsScrollable] = createSignal(true);

const App: Component = () => {
  onMount(() => {
    if (THEME === 'tea') {
      document.title = 'Random Tea Mates';
      setFavicon(teaFavicon);
    }

    setTheme();
  });

  createEffect(() => {
    const body = document.querySelector('body')!;
    body.classList[isScrollable() ? 'remove' : 'add']('not-scrollable');
  });

  return (
    <div classList={{ 'theme-tea': THEME === 'tea' }}>
      <Routes>
        <Route path="/breaks/:id" component={BreakPage} />
        <Route path="/sign-up" component={SignUp} />
        <Route path="/login" component={SignIn} />
        <Route path="/" component={Home} />
      </Routes>

      <Modal />
      <Notification />
    </div>
  );
};

export default App;
