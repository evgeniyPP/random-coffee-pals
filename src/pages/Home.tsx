import { Component } from 'solid-js';
import { supabase } from '../utils/api';
import Layout from '../Layout';
import Intro from './Intro';
import Members from './Members';

const Home: Component = () => {
  const user = supabase.auth.user();

  if (!user?.id) {
    return <Intro />;
  }

  return (
    <Layout>
      <Members />
    </Layout>
  );
};

export default Home;
