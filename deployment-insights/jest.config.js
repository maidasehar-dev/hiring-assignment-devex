module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  globals: {
    'ts-jest': {
      tsconfig: {
        esModuleInterop: true,
        moduleResolution: 'node',
        module: 'commonjs'
      }
    }
  }
};