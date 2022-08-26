import { Route, Routes } from '@solidjs/router';
import { Component } from 'solid-js';

import Home from './pages/Home';
import SignIn from './pages/SignIn';

const App: Component = () => {
  return (
    <>
      <Routes>
        <Route path="/login" component={SignIn} />
        <Route path="/" component={Home} />
      </Routes>
    </>
  );
};

export default App;
