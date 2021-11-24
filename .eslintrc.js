module.exports = {
  extends: 'eslint:recommended',
  env: {
    node: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 2021,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
      { usePrettierrc: true },
    ], // Use our .prettierrc file as source
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-console': 'off',
  },
};
