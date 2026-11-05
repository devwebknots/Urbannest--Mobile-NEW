/**
 * Application Environment Configuration
 * Centralized environment variables and runtime settings.
 */

export type Environment = 'development' | 'staging' | 'production';

export interface AppConfig {
  readonly appName: string;
  readonly env: Environment;
  readonly apiBaseUrl: string;
  readonly apiTimeout: number;
  readonly enableLogging: boolean;
  readonly apiVersion: string;
}

const isDev = __DEV__;

export const config: AppConfig = {
  appName: 'UrbanNest',
  env: isDev ? 'development' : 'production',
  apiBaseUrl: isDev ? 'https://api.dev.urbannest.com' : 'https://api.urbannest.com',
  apiTimeout: 15000,
  enableLogging: isDev,
  apiVersion: 'v1',
};

export default config;
