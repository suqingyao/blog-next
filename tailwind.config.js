/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: 'var(--font-sans)',
        serif: 'var(--font-serif)'
      },
      colors: {
        primary: 'var(--color-primary)',
        'skeleton-color': 'var(--skeleton-color)',
        'skeleton-to-color': 'var(--skeleton-to-color)'
      },
      keyframes: {
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
        },
        'skeleton-loading': {
          '0%': { 'background-position': '100% 50%' },
          '100%': { 'background-position': '0 50%' }
        }
      },
      animation: {
        'slide-enter-in': 'slide-enter-in 1s both 1',
        'bounce-enter-in': 'bounce-enter-in 0.5s',
        'bounce-leave-out': 'bounce-leave-out 0.5s',
        'skeleton-loading': 'skeleton-loading 2s linear infinite'
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
};
