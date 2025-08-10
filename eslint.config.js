import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({ baseDirectory: import.meta.url });

export default [
  ...compat.config({
    extends: [
      'next/core-web-vitals',    // reglas Next.js
      'plugin:@typescript-eslint/recommended',  // reglas TypeScript
      'plugin:react/recommended',  // reglas React
      'prettier'                  // integración con Prettier para formato
    ],
  }),

  {
    files: ['*.ts', '*.tsx'],
    parserOptions: {
      project: './tsconfig.json',
    },
  },
];