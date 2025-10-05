/**
 * API Configuration for Tyrian Platform
 */

export const API_CONFIG = {
  // Auth Server URL
  AUTH_BASE_URL: process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:8001',
  
  // Timeout settings
  TIMEOUT: 30000, // 30 seconds
  
  // Retry settings
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
};

/**
 * Get full API URL for auth endpoints
 */
export function getAuthUrl(endpoint: string): string {
  const base = API_CONFIG.AUTH_BASE_URL;
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${base}${path}`;
}

/**
 * Check if we're in production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Check if we're in development
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

