module.exports = {
  preset: 'react-native',
  moduleNameMapper: {
    '@clerotri/(.*)': '<rootDir>/src/$1',
  },
  setupFiles: ['./node_modules/react-native-gesture-handler/jestSetup.js', './jest.setup.js'],
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?@?react-native|@react-native-community|@react-navigation|revolt)',
  ],
  moduleDirectories: [
    '<rootDir>/node_modules',
    'node_modules',
  ],
};
