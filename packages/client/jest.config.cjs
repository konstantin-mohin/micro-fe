module.exports = {
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/jest.polyfills.ts'],
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  transform: {
    '^.+\\.(ts|tsx|js|jsx|mjs)$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^shared$': '<rootDir>/../shared/src/index.ts',
    '^ui$': '<rootDir>/../ui/src/index.ts',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(msw|until-async|@mswjs|@open-draft|rettime|type-fest|@bundled-es-modules)/)',
  ],
};
