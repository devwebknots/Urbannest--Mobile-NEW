/**
 * Auth ViewModel: useAuth
 * Orchestrates business logic, state machine synchronization, API calls,
 * token persistence, and data transformation for UI consumption.
 */

import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { tokenStorage } from '@/services/storage/tokenStorage';
import { isValidEmail, isNotEmpty } from '@/utils/validators';
import { capitalize } from '@/utils/formatters';
import { authApi } from '../api';
import {
  authFailure,
  authLogout,
  authPending,
  authSuccess,
  clearAuthError,
} from '../slice';
import { AuthState, AuthUser, LoginCredentials } from '../types';

export interface UseAuthViewModel {
  // State
  readonly status: AuthState['status'];
  readonly isAuthenticated: boolean;
  readonly isLoading: boolean;
  readonly errorMessage: string | null;
  readonly user: AuthUser | null;

  // Formatted data for Views
  readonly userDisplayName: string;
  readonly welcomeMessage: string;

  // Business Actions
  readonly login: (credentials: LoginCredentials) => Promise<boolean>;
  readonly logout: () => Promise<void>;
  readonly clearError: () => void;
}

export const useAuth = (): UseAuthViewModel => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);

  const isAuthenticated = authState.status === 'authenticated';
  const isLoading = authState.status === 'loading';
  const errorMessage = authState.error;
  const user = authState.user;

  // Formatted data prepared for dumb View consumption
  const userDisplayName = useMemo(() => {
    if (!user?.name) return '';
    return capitalize(user.name);
  }, [user?.name]);

  const welcomeMessage = useMemo(() => {
    if (userDisplayName) {
      return `Welcome back, ${userDisplayName}!`;
    }
    return 'Welcome to UrbanNest';
  }, [userDisplayName]);

  // Business Logic: Login orchestration
  const login = useCallback(
    async (credentials: LoginCredentials): Promise<boolean> => {
      // Step 1: Input Validation
      if (!isNotEmpty(credentials.email)) {
        dispatch(authFailure('Please enter your email address'));
        return false;
      }

      if (!isValidEmail(credentials.email)) {
        dispatch(authFailure('Please enter a valid email address'));
        return false;
      }

      if (!isNotEmpty(credentials.password)) {
        dispatch(authFailure('Please enter your password'));
        return false;
      }

      // Step 2: Trigger State Transition -> 'loading'
      dispatch(authPending());

      try {
        // Step 3: Network Operation via Model API client
        const response = await authApi.login(credentials);
        const { user: authedUser, tokens } = response.data;

        // Step 4: Persist Session Tokens
        await tokenStorage.setAccessToken(tokens.accessToken);
        await tokenStorage.setRefreshToken(tokens.refreshToken);

        // Step 5: Trigger State Transition -> 'authenticated'
        dispatch(authSuccess({ user: authedUser, tokens }));
        return true;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'Authentication failed. Please verify credentials.';
        dispatch(authFailure(message));
        return false;
      }
    },
    [dispatch]
  );

  // Business Logic: Logout orchestration
  const logout = useCallback(async (): Promise<void> => {
    try {
      await authApi.logout();
    } catch {
      // Proceed with local logout regardless of network error
    } finally {
      await tokenStorage.clear();
      dispatch(authLogout());
    }
  }, [dispatch]);

  // Business Logic: Clear transient error
  const clearError = useCallback(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  return {
    status: authState.status,
    isAuthenticated,
    isLoading,
    errorMessage,
    user,
    userDisplayName,
    welcomeMessage,
    login,
    logout,
    clearError,
  };
};

export default useAuth;
