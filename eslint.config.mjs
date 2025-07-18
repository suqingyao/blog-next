import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';
import eslintJs from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import eslintSimpleImportSort from 'eslint-plugin-simple-import-sort';
import eslintTypescript from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname
});

const eslintConfig = [
  ...eslintTypescript.config(
    eslintJs.configs.recommended,
    ...eslintTypescript.config.recommended
  ),
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'prettier'),
  eslintSimpleImportSort,
  eslintUnusedImports,
  eslintPluginPrettierRecommended,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      'unused-imports/no-unused-imports': 'off',
      'import/named': 'off',
      'import/no-anonymous-default-export': 'off',
      'import/no-named-as-default': 'off',
      'react/react-in-jsx-scope': 'off',
      'react-hooks/exhaustive-deps':
        process.env.NODE_ENV === 'production' ? 'off' : 'warn',
      'import/no-named-as-default-member': 'off',
      'react/no-unknown-property': ['error', { ignore: ['tw'] }],
      'tailwindcss/no-custom-classname': 'off',
      'react/prop-types': 'off'
    },
    ignores: ['node_modules', '.next', '.git', 'lottie', 'dist']
  }
];

export default eslintConfig;
