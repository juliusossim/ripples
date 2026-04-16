const { readFileSync } = require('fs');

const swcJestConfig = JSON.parse(readFileSync(`${__dirname}/.spec.swcrc`, 'utf-8'));
swcJestConfig.swcrc = false;

module.exports = {
  displayName: 'api',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  watchman: false,
  transform: {
    '^.+\\.[tj]s$': ['@swc/jest', swcJestConfig],
  },
  moduleNameMapper: {
    '^@org/types$': '<rootDir>/../../shared/types/src/index.ts',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  collectCoverageFrom: [
    'src/app/auth/auth.service.ts',
    'src/app/auth/services/auth-config.service.ts',
    'src/app/auth/services/password.service.ts',
    'src/app/auth/services/token.service.ts',
    'src/app/feed/**/*.ts',
    'src/app/property/**/*.ts',
  ],
  coverageDirectory: 'test-output/jest/coverage',
  coverageReporters: ['lcov', 'text-summary'],
};
