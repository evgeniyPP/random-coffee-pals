import { Component } from 'solid-js';
import Header from '../components/Header';
import { supabase } from '../utils/api';
import Intro from './Intro';
import Members from './Members';

const Home: Component = () => {
  const user = supabase.auth.user();

  if (!user?.id) {
    return <Intro />;
  }

  return (
    <>
      <Header />
      <div class="bg-white min-h-main">
        <Members />
      </div>
    </>
  );
};

export default Home;
