/**
 * Global App Providers
 * Wraps the app with all necessary context providers (Redux, SafeArea, etc.)
 */

import React, { ReactNode } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from '@/store';

export interface AppProvidersProps {
  readonly children: ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        />
        {children}
      </SafeAreaProvider>
    </Provider>
  );
};

export default AppProviders;
