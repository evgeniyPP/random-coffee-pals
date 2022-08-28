import { THEME } from './env';

const tea: Record<string, string> = {
  coffee: 'tea',
  Coffee: 'Tea',
  Pal: 'Mate',
  pal: 'mate',
  pals: 'mates',
  'coffee pal': 'tea mate',
  'Coffee Pals': 'Tea Mates'
};

export function t(text: string) {
  return THEME === 'coffee' ? text : tea[text] ?? text;
}
