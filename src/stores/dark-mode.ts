import { createSignal } from 'solid-js';

export const [isDarkMode, setIsDarkMode] = createSignal(false);

export function setDarkMode(value: boolean) {
  localStorage.setItem('theme', value ? 'dark' : 'light');
  setTheme();
}

export function setTheme() {
  const theme = localStorage.getItem('theme');

  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    setIsDarkMode(true);
  } else {
    document.documentElement.classList.remove('dark');
    setIsDarkMode(false);
  }
}
