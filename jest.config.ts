/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  roots: ['<rootDir>/src'],
  rootDir: './',
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}',
  ],
  testEnvironment: 'node',
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$',
  ],
  moduleFileExtensions: ['js', 'ts', 'jsx', 'tsx', 'json', 'node'],
  // resetMocks: true,
};
