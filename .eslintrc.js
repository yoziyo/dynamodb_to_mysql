module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  rules: {
    'no-console': 'off',
    'prettier/prettier': 'error',
    'arrow-body-style': 'off',
    'prefer-arrow-callback': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
  },
  ignorePatterns: ['.eslintrc.js'],
  // overrides: [
  //   {
  //     files: ['**/*.ts'],
  //     parser: '@typescript-eslint/parser',
  //     parserOptions: {
  //       project: 'tsconfig.json',
  //       tsconfigRootDir: __dirname,
  //       sourceType: 'module',
  //     },
  //     plugins: ['@typescript-eslint'],
  //   },
  // ],
};
