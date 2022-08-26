import type { Component } from 'solid-js';
import { supabase } from '../utils/api';
import Intro from './Intro';

const Home: Component = () => {
  const user = supabase.auth.user();

  if (!user?.id) {
    return <Intro />;
  }

  return (
    <>
      <h1 class="font-black text-2xl">HOME PAGE</h1>
    </>
  );
};

export default Home;
