/**
 * API Service Error and Client Contracts
 */

export class AppApiError extends Error {
  public readonly code: string;
  public readonly status?: number;
  public readonly details?: unknown;

  constructor(message: string, code = 'API_ERROR', status?: number, details?: unknown) {
    super(message);
    this.name = 'AppApiError';
    this.code = code;
    this.status = status;
    this.details = details;
    Object.setPrototypeOf(this, AppApiError.prototype);
  }
}
