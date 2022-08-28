import type { Component, JSX } from 'solid-js';
import Header from './components/Header';

const Layout: Component<{ children: JSX.Element }> = props => {
  return (
    <>
      <Header />
      <div class="theme-default min-h-main">{props.children}</div>
    </>
  );
};

export default Layout;
