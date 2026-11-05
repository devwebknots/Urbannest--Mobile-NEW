/* eslint-disable no-undef */
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock';

jest.mock('react-native-safe-area-context', () => mockSafeAreaContext);

jest.mock('react-native-video', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: View,
    ViewType: { TEXTURE: 0, SURFACE: 1, SURFACE_SECURE: 2 },
  };
});
