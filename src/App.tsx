import { Route, Routes } from '@solidjs/router';
import { Component, lazy } from 'solid-js';
import Modal from './components/Modal';
import Notification from './components/Notification';

const BreakPage = lazy(() => import('./pages/BreakPage'));
const SignIn = lazy(() => import('./pages/SignIn'));
const Home = lazy(() => import('./pages/Home'));

const App: Component = () => {
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
