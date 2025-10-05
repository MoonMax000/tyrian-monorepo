import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/screens/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        foreground: 'var(--foreground)',
        primary: '#A06AFF',
        secondary: '#808283',
        card: 'var(--card)',

        background: 'var(--color-bg)',
        blackedGray: 'var(--color-darkCharcoal)',
        purple: 'var(--color-lavenderIndigo)',

        moonlessNight: 'var(--color-moonlessNight)',
        onyxGrey: 'var(--color-onyxGrey)',

        white: 'var(--color-white)',
        webGray: 'var(--color-webGray)',
        black: 'var(--color-black)',

        green: 'var(--color-mountainMeadow)',
        red: 'var(--color-fieryRose)',

        orange: 'var(--color-orangePeel)',
        darkOrange: 'var(--color-darkOrange)',
        blue: 'var(--color-cornflowerBlue)',
        darkGreen: 'var(--color-darkJungleGreen)',
        darkRed: 'var(--color-darkSienna)',
        gunpowder: 'var(--color-gunpowder)',
        regaliaPurple: 'var(--color-regaliaPurple)',
        whiteGray: 'var(--color-whiteGray)',

        lighterAluminum: 'var(--color-lighterAluminum)',
        darkPurple: 'var(--color-darkPurple)',
        lightPurple: 'var(--color-lightPurple)',
        freshGreen: 'var(--color-freshGreen)',
        indigo: 'var(--color-indigo)',
        richBlack: 'var(--color-richBlack)',
        lightGray: '#1F2229',
        gray: '#272A32',
        'custom-dark': '#0C1014',
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.custom-bg-blur': {
          'background-color': '#0C101480',
          'backdrop-filter': 'blur(100px)',
          '-webkit-backdrop-filter': 'blur(100px)',
        },
      });
    }),
  ],
} satisfies Config;
