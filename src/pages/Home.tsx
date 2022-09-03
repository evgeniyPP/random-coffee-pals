import { Component } from 'solid-js';
import { supabase } from '../utils/api';
import Layout from '../Layout';
import Intro from './Intro';
import Members from './Members';
import Rooms from '../components/Rooms';

const Home: Component = () => {
  const user = supabase.auth.user();

  if (!user?.id) {
    return <Intro />;
  }

  return (
    <Layout>
      <Members />
      <Rooms />
    </Layout>
  );
};

export default Home;
