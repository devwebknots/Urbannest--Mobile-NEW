/**
 * Root Reducer Configuration
 * Aggregates all domain feature reducers.
 */

import { combineReducers } from '@reduxjs/toolkit';
import { authReducer } from '@/features/auth/slice';

export const rootReducer = combineReducers({
  auth: authReducer,
  // Additional feature reducers are wired here:
  // user: userReducer,
  // settings: settingsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
