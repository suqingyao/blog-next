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
      colors: {
        primary: '#22c55e'
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
        }
      },
      animation: {
        'slide-enter-in': 'slide-enter-in 1s both 1',
        'bounce-enter-in': 'bounce-enter-in 0.5s',
        'bounce-leave-out': 'bounce-leave-out 0.5s'
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
};
