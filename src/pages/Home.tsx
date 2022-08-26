import type { Component } from 'solid-js';
import Header from '../components/Header';
import { supabase } from '../utils/api';
import Intro from './Intro';

const Home: Component = () => {
  const user = supabase.auth.user();

  if (!user?.id) {
    return <Intro />;
  }

  return (
    <>
      <Header />
    </>
  );
};

export default Home;
