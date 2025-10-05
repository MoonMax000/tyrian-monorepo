import { Golos_Text, IBM_Plex_Sans, Roboto } from 'next/font/google';

export const roboto = Roboto({
  subsets: ['latin', 'cyrillic'],
  weight: ['100', '300', '400', '500', '700'],
  variable: '--font-roboto',
});
export const mainFont = Golos_Text({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
});
