import type { Config } from 'tailwindcss';

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
        background: 'var(--color-bg)',
        blackedGray: 'var(--color-darkCharcoal)',
        purple: 'var(--color-lavenderIndigo)',

        moonlessNight: 'var(--color-moonlessNight)',
        onyxGrey: 'var(--color-onyxGrey)',

        white: 'var(--color-white)',
        webGray: 'var(--color-webGray)',
        grayLight: 'var(--color-gray-light)',
        black: 'var(--color-black)',

        green: 'var(--color-mountainMeadow)',
        red: 'var(--color-fieryRose)',
        yellow: 'var(--color-yellow)',

        orange: 'var(--color-orangePeel)',
        blue: 'var(--color-cornflowerBlue)',
        darkGreen: 'var(--color-darkJungleGreen)',
        darkRed: 'var(--color-darkSienna)',
        gunpowder: 'var(--color-gunpowder)',
        regaliaPurple: 'var(--color-regaliaPurple)',
        textGray: 'var(--color-textGray)',

        lightGray: '#1F2229',
        gray: '#272A32',
      },
      letterSpacing: {
        '-2': '-0.02em',
      },
      opacity: {
        '48': '0.48',
      },

      screens: {
        maxContainer: {
          max: '1260px',
        },
      },
    },
  },
  safelist: ['bg-red', 'bg-purple', 'bg-blue', 'bg-green', 'bg-orange'],
  plugins: [],
} satisfies Config;
