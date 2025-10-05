/**
 * @tyrian/api - Unified API Client for Tyrian Platform
 * 
 * Provides shared authentication and API utilities for all frontend applications
 */

// Auth exports
export * from './auth';

// Config exports
export * from './config';

// Re-export types for convenience
export type {
  LoginCredentials,
  RegisterData,
  User,
  AuthResponse,
} from './auth';

