/**
 * @tyrian/api - Unified API Client for Tyrian Platform
 * 
 * Provides shared authentication and API utilities for all frontend applications
 */

// Auth exports
export * from './lib/auth';

// Config exports
export * from './lib/config';

// Re-export types for convenience
export type {
  LoginCredentials,
  RegisterData,
  User,
  AuthResponse,
} from './lib/auth';
