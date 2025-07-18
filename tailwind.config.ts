import {
  createVariableColors,
  variableColorsPlugin
} from 'tailwindcss-variable-colors';
import { getIconCollections, iconsPlugin } from '@egoist/tailwindcss-icons';
import * as tailwindScrollbarHide from 'tailwind-scrollbar-hide';

const config = {
  darkMode: ['class', 'html.dark'],
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
    }
  },
  plugins: [
    tailwindScrollbarHide,
    variableColorsPlugin(),
    iconsPlugin({
      collections: {
        ...getIconCollections(['mingcute'])
      }
    })
  ]
};

export default config;
