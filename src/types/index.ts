/**
 * Global TypeScript Interfaces & Utility Types
 */

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

export interface BaseEntity {
  readonly id: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface User extends BaseEntity {
  readonly email: string;
  readonly name: string;
  readonly avatar?: string;
  readonly role: 'admin' | 'user' | 'guest';
}

export * from './api';
export * from './navigation';
