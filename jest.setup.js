jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

global.IS_REACT_ACT_ENVIRONMENT = true;

jest.mock('@react-native-documents/picker', () => ({
  errorCodes: { OPERATION_CANCELED: 'OPERATION_CANCELED' },
  isErrorWithCode: jest.fn(() => false),
  pick: jest.fn(),
  types: { images: 'image/*' },
}));

jest.mock('react-native-multiple-select', () => {
  const React = require('react');
  const { View } = require('react-native');

  return function MockMultiSelect() {
    return React.createElement(View);
  };
});

jest.mock('uuid', () => ({
  v4: jest.fn(() => '00000000-0000-4000-8000-000000000000'),
}));
