module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json'
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'jsx-a11y',
    'import'
  ],
  extends: [
    'next/core-web-vitals',        // Reglas recomendadas por Next.js
    'eslint:recommended',          // Buenas prácticas básicas
    'plugin:@typescript-eslint/recommended', // TS recomendado
    'plugin:react/recommended',    // Buenas prácticas React
    'plugin:jsx-a11y/recommended', // Accesibilidad JSX
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier'                     // Usa formato de Prettier y evita conflictos
  ],
  rules: {
    // Reglas personalizadas (ajusta según tus preferencias)
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn', // 'error' si quieres ser más estricto
    'react/react-in-jsx-scope': 'off', // No necesario en Next.js
    'react/jsx-no-target-blank': 'warn',
    'import/order': [
      'warn',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling', 'index']
        ],
        alphabetize: { order: 'asc', caseInsensitive: true }
      }
    ]
  },
  settings: {
    react: {
      version: 'detect'
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json'
      },
      alias: {
        map: [['@', './frontend']],
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
      }
    }
  }
};
