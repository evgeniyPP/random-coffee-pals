import { Route, Routes } from '@solidjs/router';
import { Component, lazy, onMount } from 'solid-js';
import Modal from './components/Modal';
import Notification from './components/Notification';
import { setTheme } from './stores/dark-mode';

const BreakPage = lazy(() => import('./pages/BreakPage'));
const SignIn = lazy(() => import('./pages/SignIn'));
const Home = lazy(() => import('./pages/Home'));

const App: Component = () => {
  onMount(() => setTheme());

  return (
    <>
      <Routes>
        <Route path="/breaks/:id" component={BreakPage} />
        <Route path="/login" component={SignIn} />
        <Route path="/" component={Home} />
      </Routes>

      <Modal />
      <Notification />
    </>
  );
};

export default App;
