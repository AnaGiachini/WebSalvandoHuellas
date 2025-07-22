module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js', '**/tests/**/*.spec.js', '**/tests/**/*.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // ✅ más recomendable que `setupFiles`
};

