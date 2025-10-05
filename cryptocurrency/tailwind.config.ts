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
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        purple: '#a06aff',
        blackedGray: '#181A20',
        lightGray: '#1F2229',
        green: '#2EBD85',
        mountainMeadow: 'var(--color-mountainMeadow)',
        fieryRose: 'var(--color-fieryRose)',
        lavenderIndigo: 'var(--color-lavenderIndigo)',
        red: '#ff5757',
        error: '#EF454A',
        white: '#FFFFFF',
        cornflowerBlue: 'var(--color-cornflowerBlue)',
        moonlessNight: 'var(--color-moonlessNight)',
        orangePeel: 'var(--color-orangePeel',
        onyxGrey: 'var(--color-onyxGrey)',
        webGray: 'var(--color-webGray)',
        black: 'var(--color-black)',

        // 🎨 Chart colors
        chartBlue: 'var(--color-chartBlue)',
        chartPink: 'var(--color-chartPink)',
        chartGreen: 'var(--color-chartGreen)',
        chartOrange: 'var(--color-chartOrange)',
        chartPurple: 'var(--color-chartPurple)',
        chartLightBlue: 'var(--color-chartLightBlue)',
        chartLightPink: 'var(--color-chartLightPink)',
        chartMint: 'var(--color-chartMint)',
        chartYellow: 'var(--color-chartYellow)',
      },
      screens: {
        maxContainer: {
          max: '1300px',
        },
      },
      rotate: {
        '38': '38deg',
        '-38': '-38deg',
      },
    },
  },
  plugins: [],
} satisfies Config;
