/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': ['ts-jest', {}],
  },
  moduleNameMapper: {
    '^@/src/(.*)$': '<rootDir>/src/$1',
  },
}
