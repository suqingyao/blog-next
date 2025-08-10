import antfu from '@antfu/eslint-config'
import nextPlugin from '@next/eslint-plugin-next'

export default antfu({
  react: true,
  stylistic: {
    quotes: 'single',
    semi: true,
    indent: 2,
  },
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
  plugins: [
    nextPlugin,
  ],
  ignores: [
    'node_modules',
    'dist',
    '.next',
  ],
})
