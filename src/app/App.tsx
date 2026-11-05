/**
 * Application Entry Component
 * Composes global providers and root navigation stack.
 */

import React from 'react';
import { AppProviders } from './providers';
import { RootNavigator } from '../navigation';

export const App: React.FC = () => {
  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  );
};

export default App;
