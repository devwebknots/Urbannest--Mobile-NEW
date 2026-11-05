/**
 * Global API Types and Contracts
 */

export interface ApiResponse<T = unknown> {
  readonly success: boolean;
  readonly data: T;
  readonly message?: string;
  readonly timestamp: string;
}

export interface ApiErrorResponse {
  readonly success: false;
  readonly error: {
    readonly code: string;
    readonly message: string;
    readonly details?: Record<string, unknown>;
  };
  readonly timestamp: string;
}

export interface PaginatedResponse<T> {
  readonly items: readonly T[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
  readonly hasMore: boolean;
}

export interface RequestConfig {
  readonly headers?: Record<string, string>;
  readonly params?: Record<string, unknown>;
  readonly timeout?: number;
}
