module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  settings: {
    react: {
      version: 'detect',
    },
    next: {
      rootDir: ['apps/*/', 'packages/*/'],
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: ['apps/*/tsconfig.json'],
      },
    },
  },
  extends: [
    'turbo',
    'prettier',
    'next/core-web-vitals', // Needed to avoid warning in next.js build: 'The Next.js plugin was not detected in your ESLint configuration',
    'plugin:prettier/recommended',
    'plugin:import/recommended',
  ],
  plugins: ['import', 'simple-import-sort', '@typescript-eslint'],
  rules: {
    'prettier/prettier': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': ['warn'],
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
      },
    ],
    // 'no-empty-function': 'off',
    // '@typescript-eslint/no-empty-function': 'warn',
    // 'no-explicit-any': 'off',
    // '@typescript-eslint/no-explicit-any': 'off',
    // 'no-empty-interface': 'off',
    // '@typescript-eslint/no-empty-interface': 'warn',
    // 'react/prop-types': 'off',
    // 'explicit-module-boundary-types': 'off',
    // '@typescript-eslint/explicit-module-boundary-types': 'off',
    // '@typescript-eslint/ban-types': 'off',
    // 'react/destructuring-assignment': 'off', // Vscode doesn't support automatically destructuring, it's a pain to add a new variable
    // 'react/require-default-props': 'off', // Allow non-defined react props as undefined
    // 'react/jsx-props-no-spreading': 'off', // _app.tsx uses spread operator and also, react-hook-form
    // '@next/next/no-img-element': 'off', // We currently not using next/image because it isn't supported with SSG mode
    // '@typescript-eslint/comma-dangle': 'off', // Avoid conflict rule between Eslint and Prettier
    // '@typescript-eslint/consistent-type-imports': 'error', // Ensure `import type` is used when it's necessary
    // '@typescript-eslint/consistent-type-definitions': 'off',
    // '@typescript-eslint/explicit-function-return-type': 'off',
    // 'import/prefer-default-export': 'off', // Named export is easier to refactor automatically
    // 'simple-import-sort/imports': 'error', // Import configuration for `eslint-plugin-simple-import-sort`
    // 'simple-import-sort/exports': 'error', // Export configuration for `eslint-plugin-simple-import-sort`
    // 'no-unused-vars': 'warn',
    // // 'unused-imports/no-unused-imports': 'error',
    // // 'unused-imports/no-unused-vars': [
    // //   'warn',
    // //   {
    // //     vars: 'all',
    // //     varsIgnorePattern: '^_',
    // //     args: 'after-used',
    // //     argsIgnorePattern: '^_',
    // //   },
    // // ],
    // 'import/no-named-as-default': 'off',
    // 'react/no-unescaped-entities': 'off',
    // 'no-console': 'warn',
  },
  ignorePatterns: ['**/*.js', '**/*.json', 'node_modules', 'public', 'styles', '.next', 'coverage', 'dist', '.turbo'],
};
