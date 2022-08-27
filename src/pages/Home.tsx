import { Component } from 'solid-js';
import Header from '../components/Header';
import Modal from '../components/Modal';
import { supabase } from '../utils/api';
import Intro from './Intro';
import Teammates from './Teammates';

const Home: Component = () => {
  const user = supabase.auth.user();

  if (!user?.id) {
    return <Intro />;
  }

  return (
    <>
      <Header />
      <div class="bg-white min-h-main">
        <Teammates />
      </div>

      <Modal />
    </>
  );
};

export default Home;
