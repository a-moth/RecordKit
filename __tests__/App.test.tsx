/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../app/_layout';

// `<Stack />` needs Expo Router's full navigation context (route matching,
// link preview state, etc.), which only exists under the real router root
// (`ExpoRoot`). This smoke test only cares that this app's own provider
// tree (SettingsProvider/ThemeProvider) mounts without throwing, so stub
// out `Stack` rather than reconstructing Expo Router's internals here.
jest.mock('expo-router', () => ({
  ...jest.requireActual('expo-router'),
  Stack: () => null,
}));

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
