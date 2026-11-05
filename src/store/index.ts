/**
 * Redux Toolkit Store Configuration
 * Configures the centralized store, middleware, and exports global type definitions.
 */

import { configureStore } from '@reduxjs/toolkit';
import rootReducer, { RootState } from './rootReducer';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable headers if necessary
        ignoredActions: [],
      },
    }),
  devTools: __DEV__,
});

export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;
export type { RootState };

// Re-export strictly typed hooks
export { useAppDispatch, useAppSelector } from './hooks';
export default store;
