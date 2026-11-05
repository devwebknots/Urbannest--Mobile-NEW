/**
 * Auth Feature Types
 * Defines the Model contracts and the discriminated union state machine.
 */

export interface AuthUser {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly avatar?: string;
  readonly role: 'admin' | 'user' | 'guest';
}

export interface AuthTokens {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly expiresIn: number;
}

export interface LoginCredentials {
  readonly email: string;
  readonly password: string;
}

export interface LoginResponse {
  readonly user: AuthUser;
  readonly tokens: AuthTokens;
}

/**
 * Discriminated Union Auth State Machine
 * Guarantees mutually exclusive states and prevents invalid permutations (e.g. loading with authenticated user).
 */
export type AuthState =
  | {
      readonly status: 'idle';
      readonly user: null;
      readonly tokens: null;
      readonly error: null;
    }
  | {
      readonly status: 'loading';
      readonly user: null;
      readonly tokens: null;
      readonly error: null;
    }
  | {
      readonly status: 'authenticated';
      readonly user: AuthUser;
      readonly tokens: AuthTokens;
      readonly error: null;
    }
  | {
      readonly status: 'unauthenticated';
      readonly user: null;
      readonly tokens: null;
      readonly error: null;
    }
  | {
      readonly status: 'error';
      readonly user: null;
      readonly tokens: null;
      readonly error: string;
    };
