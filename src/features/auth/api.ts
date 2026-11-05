/**
 * Auth Model: API Client
 * Encapsulates network operations using Axios with mock fallback.
 */

import { AxiosResponse } from 'axios';
// import { apiClient } from '@/services/api/client';
// import { ENDPOINTS } from '@/services/api/endpoints';
import { AuthUser, LoginCredentials, LoginResponse } from './types';

export const authApi = {
  /**
   * Performs user login with credentials.
   * Simulates network latency and Axios response structure.
   */
  login: async (credentials: LoginCredentials): Promise<AxiosResponse<LoginResponse>> => {
    // In live backend integration:
    // return apiClient.post<LoginResponse>(ENDPOINTS.AUTH.LOGIN, credentials);

    // Mock API simulation:
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 800));

    if (credentials.password === 'error123') {
      throw new Error('Invalid email or password combination');
    }

    const mockResponse: AxiosResponse<LoginResponse> = {
      data: {
        user: {
          id: 'usr_mock_001',
          email: credentials.email,
          name: credentials.email.split('@')[0].toUpperCase(),
          role: 'user',
        },
        tokens: {
          accessToken: `mock_access_jwt_${Date.now()}`,
          refreshToken: `mock_refresh_jwt_${Date.now()}`,
          expiresIn: 3600,
        },
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        headers: {},
      } as AxiosResponse['config'],
    };

    return mockResponse;
  },

  /**
   * Invalidate current user session.
   */
  logout: async (): Promise<AxiosResponse<{ success: boolean }>> => {
    // In live backend integration:
    // return apiClient.post(ENDPOINTS.AUTH.LOGOUT);

    await new Promise<void>((resolve) => setTimeout(() => resolve(), 400));
    return {
      data: { success: true },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { headers: {} } as AxiosResponse['config'],
    };
  },

  /**
   * Retrieve currently authenticated user profile.
   */
  fetchCurrentUser: async (): Promise<AxiosResponse<AuthUser>> => {
    // In live backend integration:
    // return apiClient.get<AuthUser>(ENDPOINTS.AUTH.ME);

    await new Promise<void>((resolve) => setTimeout(() => resolve(), 500));
    return {
      data: {
        id: 'usr_mock_001',
        email: 'user@urbannest.com',
        name: 'Demo User',
        role: 'user',
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { headers: {} } as AxiosResponse['config'],
    };
  },
};

export default authApi;
