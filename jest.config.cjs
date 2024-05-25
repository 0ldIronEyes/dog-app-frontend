module.exports = {
    setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
    transform: {
      '^.+\\.[t|j]sx?$': 'babel-jest',
    },
    moduleFileExtensions: ['js', 'jsx'],
    testEnvironment: 'jsdom',
  };
  