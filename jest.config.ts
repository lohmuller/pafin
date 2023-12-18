/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  globalTeardown: './src/__test__/globalTeardown.ts',
  testEnvironment: 'node',
};