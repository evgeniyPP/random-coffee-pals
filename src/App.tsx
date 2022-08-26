import { Component } from 'solid-js';
import SignIn from './pages/SignIn';
import { supabase } from './utils/api';

const App: Component = () => {
  const user = supabase.auth.user();

  if (!user?.id) {
    return <SignIn />;
  }

  return (
    <>
      <h1>Main Page</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </>
  );
};

export default App;
