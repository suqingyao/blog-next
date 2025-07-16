import type { Config } from 'tailwindcss';
import {
  createVariableColors,
  getDefaultColors,
  variableColorsPlugin
} from 'tailwindcss-variable-colors';

import { iconsPlugin } from '@egoist/tailwindcss-icons';

const config = {
  darkMode: ['class', 'html.dark'],
  safelist: ['i-mingcute-copy-2-line'],
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  prefix: '',
  theme: {
    colors: createVariableColors(),
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        primary: 'var(--primary-color)',
        border: 'var(--border-color)',
        accent: 'var(--theme-color)',
        hover: 'var(--hover-color)',
        always: getDefaultColors() as any
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        serif: ['var(--font-serif)']
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'slide-enter-in': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'bounce-enter-in': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '50%': { transform: 'translateY(-10px)', opacity: '0.5' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'bounce-leave-out': {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(100px)', opacity: '0' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'slide-enter-in': 'slide-enter-in 1s both 1',
        'bounce-enter-in': 'bounce-enter-in 0.5s',
        'bounce-leave-out': 'bounce-leave-out 0.5s'
      }
    }
  },
  plugins: [
    // require('@tailwindcss/typography'),
    require('tailwindcss-animate'),
    require('tailwind-scrollbar-hide'),
    variableColorsPlugin(),
    iconsPlugin()
  ]
} satisfies Config;

export default config;
