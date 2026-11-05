/**
 * Auth Model: Redux Toolkit Slice
 * Stores raw authentication state and defines state transitions.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, AuthTokens, AuthUser } from './types';

const initialState: AuthState = {
  status: 'idle',
  user: null,
  tokens: null,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialState as AuthState,
  reducers: {
    authPending: (): AuthState => ({
      status: 'loading',
      user: null,
      tokens: null,
      error: null,
    }),
    authSuccess: (
      _state,
      action: PayloadAction<{ user: AuthUser; tokens: AuthTokens }>
    ): AuthState => ({
      status: 'authenticated',
      user: action.payload.user,
      tokens: action.payload.tokens,
      error: null,
    }),
    authFailure: (_state, action: PayloadAction<string>): AuthState => ({
      status: 'error',
      user: null,
      tokens: null,
      error: action.payload,
    }),
    authLogout: (): AuthState => ({
      status: 'unauthenticated',
      user: null,
      tokens: null,
      error: null,
    }),
    clearAuthError: (state): AuthState => {
      if (state.status === 'error') {
        return {
          status: 'idle',
          user: null,
          tokens: null,
          error: null,
        };
      }
      return state;
    },
  },
});

export const {
  authPending,
  authSuccess,
  authFailure,
  authLogout,
  clearAuthError,
} = authSlice.actions;

export const authReducer = authSlice.reducer;
export default authReducer;
