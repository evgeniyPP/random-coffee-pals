import { Route, Routes } from '@solidjs/router';
import { Component, lazy } from 'solid-js';
import BreakPage from './pages/BreakPage';

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
    </>
  );
};

export default App;
