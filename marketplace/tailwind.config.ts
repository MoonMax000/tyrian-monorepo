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
      fontFamily: {
        nunito: ['Nunito Sans', 'sans-serif'],
      },
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
        lighterAluminum: 'var(--color-lighterAluminum)',
        darkPurple: 'var(--color-darkPurple)',
        lightPurple: 'var(--color-lightPurple)',
        freshGreen: 'var(--color-freshGreen)',
        indigo: 'var(--color-indigo)',
        richBlack: 'var(--color-richBlack)',
        lightGray: '#1F2229',
        gray: '#272A32',
        'custom-dark': '#0C101480',

        // Tyrian Portfolio Design System colors
        'tyrian-black': '#000000',
        'tyrian-white': '#FFFFFF',
        'tyrian-purple-primary': '#A06AFF',
        'tyrian-purple-secondary': '#482090',
        'tyrian-purple-background': '#523A83',
        'tyrian-purple-dark': '#20252B',
        'tyrian-gray-light': '#C2C2C2',
        'tyrian-gray-medium': '#B0B0B0',
        'tyrian-gray-dark': '#313640',
        'tyrian-gray-darker': '#181B22',
        'tyrian-background-primary': '#0E1119',
        'tyrian-background-card': 'rgba(12, 16, 20, 0.48)',
        'tyrian-red-accent': '#EF454A',
        'tyrian-gold-binance': '#F0B90B',
      },
      backgroundImage: {
        'hover-card': `linear-gradient(297.06deg, rgba(160, 106, 255, 0.64) -2.41%, rgba(24, 26, 32, 0) 52.18%)`,
        gradient: `linear-gradient(270deg, rgba(160, 106, 255, 1) 0%, rgba(72, 32, 144, 1) 100%)`,
        'tyrian-gradient': `linear-gradient(270deg, #A06AFF 0%, #482090 100%)`,
        'tyrian-sidebar-gradient': `linear-gradient(180deg, rgba(82, 58, 131, 0.00) 0%, #A06AFF 50%, rgba(82, 58, 131, 0.00) 100%)`,
      },
      letterSpacing: {
        '-2': '-0.02em',
      },
      opacity: {
        '48': '0.48',
      },
      screens: {
        maxContainer: {
          max: '1080px',
        },
      },
      backdropBlur: {
        '32': '32px',
        '58': '58.333px',
        '120': '120px',
      },
    },
  },
  safelist: ['bg-red', 'bg-purple', 'bg-blue', 'bg-green', 'bg-orange'],
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.custom-bg-blur': {
          'background-color': '#0C101480',
          'backdrop-filter': 'blur(100px)',
          '-webkit-backdrop-filter': 'blur(100px)',
        },
        '.container-card': {
          'border': '1px solid #181B22',
          'border-radius': '12px',
          'background-color': 'rgba(12, 16, 20, 0.5)',
          'backdrop-filter': 'blur(100px)',
          '-webkit-backdrop-filter': 'blur(100px)',
        },
        '.hover-lift': {
          'transition': 'transform 200ms ease, box-shadow 200ms ease, background-color 200ms ease, color 200ms ease, border-color 200ms ease, opacity 200ms ease',
        },
        '.hover-lift:hover': {
          'transform': 'translateY(-1px)',
          'box-shadow': '0 0 0 1px rgba(160, 106, 255, 0.35), 0 0 24px rgba(160, 106, 255, 0.15)',
        },
        '.hover-lift:active': {
          'transform': 'translateY(0)',
        },
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
        },
        '.scrollbar-hide::-webkit-scrollbar': {
          'display': 'none',
        },
        '.glass-card': {
          'background-color': 'rgba(12, 16, 20, 0.48)',
          'backdrop-filter': 'blur(100px)',
          '-webkit-backdrop-filter': 'blur(100px)',
        },
        '.bg-tyrian-gradient-animated': {
          'background': 'linear-gradient(270deg, #A06AFF 0%, #482090 100%)',
          'background-size': '200% 200%',
          'animation': 'gradientShift 6s ease infinite',
        },
      });
    }),
  ],
} satisfies Config;
