module.exports = {
  preset: 'jest-expo',
  setupFiles: ['./jest.setup.js'],
  moduleNameMapper: {
    '^react-native-vector-icons/MaterialCommunityIcons$': '<rootDir>/__mocks__/MaterialCommunityIcons.js',
  },
};
