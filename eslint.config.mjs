import antfu from '@antfu/eslint-config';
import nextPlugin from '@next/eslint-plugin-next';

export default antfu({
  react: true,
  stylistic: {
    quotes: 'single',
    semi: true,
    indent: 2,
  },
  typescript: true,
  jsonc: false,
  yaml: false,
  plugins: {
    '@next/next': nextPlugin,
  },
  rules: {
    'no-console': 'warn',
    'react/no-context-provider': 'off',
  },
  ignores: [
    'node_modules',
    'dist',
    '.next',
    'public',
  ],
});
