module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['./node_modules/@testing-library/jest-native/extend-expect', "<rootDir>/src/mocks.ts"],
  testEnvironment: "node",
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest"
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|react-native-vector-icons)/)',
  ],
};
