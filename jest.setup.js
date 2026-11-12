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

// Native recorder / player: no-op stand-in for tests
jest.mock('react-native-nitro-sound', () => {
  const sound = () => ({
    setSubscriptionDuration: jest.fn(),
    addRecordBackListener: jest.fn(),
    removeRecordBackListener: jest.fn(),
    addPlayBackListener: jest.fn(),
    removePlayBackListener: jest.fn(),
    addPlaybackEndListener: jest.fn(),
    removePlaybackEndListener: jest.fn(),
    startRecorder: jest.fn(() => Promise.resolve('file:///voice.m4a')),
    stopRecorder: jest.fn(() => Promise.resolve('file:///voice.m4a')),
    startPlayer: jest.fn(() => Promise.resolve('')),
    pausePlayer: jest.fn(() => Promise.resolve('')),
    resumePlayer: jest.fn(() => Promise.resolve('')),
    stopPlayer: jest.fn(() => Promise.resolve('')),
  });
  return { __esModule: true, default: sound(), createSound: jest.fn(sound) };
});

jest.mock('react-native-image-picker', () => ({
  launchCamera: jest.fn(() => Promise.resolve({ didCancel: true })),
  launchImageLibrary: jest.fn(() => Promise.resolve({ didCancel: true })),
}));

// Location (native module) for the rental application "Use current location"
jest.mock('@react-native-community/geolocation', () => ({
  __esModule: true,
  default: {
    getCurrentPosition: jest.fn(),
    setRNConfiguration: jest.fn(),
    requestAuthorization: jest.fn(),
  },
}));
