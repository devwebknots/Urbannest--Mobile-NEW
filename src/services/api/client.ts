/**
 * Production-Grade Axios API Client Wrapper
 * Configured with request/response interceptors, auth token injection, and unified error handling.
 */

import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { config } from '@/config/env';
import { tokenStorage } from '@/services/storage/tokenStorage';
import { AppApiError } from './types';

/**
 * Creates and configures the default Axios client instance.
 */
export const createApiClient = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: config.apiBaseUrl,
    timeout: config.apiTimeout,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  // Request Interceptor: Attach bearer token
  instance.interceptors.request.use(
    async (requestConfig: InternalAxiosRequestConfig) => {
      try {
        const token = await tokenStorage.getAccessToken();
        if (token && requestConfig.headers) {
          requestConfig.headers.Authorization = `Bearer ${token}`;
        }
      } catch {
        // Continue request without token if retrieval fails
      }

      if (config.enableLogging) {
        console.log(`[API Request] ${requestConfig.method?.toUpperCase()} ${requestConfig.url}`);
      }

      return requestConfig;
    },
    (error: unknown) => {
      return Promise.reject(error);
    }
  );

  // Response Interceptor: Standardize responses & normalize errors
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      if (config.enableLogging) {
        console.log(`[API Response] ${response.status} ${response.config.url}`);
      }
      return response;
    },
    async (error: AxiosError<{ message?: string; code?: string; details?: unknown }>) => {
      if (config.enableLogging) {
        console.error(`[API Error]`, error.response?.status, error.message);
      }

      const status = error.response?.status;
      const responseData = error.response?.data;
      const errorMessage =
        responseData?.message ||
        error.message ||
        'An unexpected network error occurred';
      const errorCode = responseData?.code || `HTTP_${status ?? 'UNKNOWN'}`;

      // Handle 401 Unauthorized globally if token expired
      if (status === 401) {
        await tokenStorage.clear();
      }

      return Promise.reject(new AppApiError(errorMessage, errorCode, status, responseData?.details));
    }
  );

  return instance;
};

export const apiClient = createApiClient();
export default apiClient;
