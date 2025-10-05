/**
 * Authentication API Client
 * Unified auth for all Tyrian products
 */

import { getAuthUrl } from './config';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  password2: string;
  username?: string;
}

export interface User {
  id: string | number;
  email: string;
  username?: string;
  avatar?: string;
  [key: string]: any;
}

export interface AuthResponse {
  user?: User;
  token?: string;
  message?: string;
  error?: string;
}

/**
 * Login user
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const response = await fetch(getAuthUrl('/api/accounts/login/'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include', // Important for cookies!
    });

    if (!response.ok) {
      const error = await response.json();
      return { error: error.message || 'Login failed' };
    }

    const data = await response.json();
    return { user: data.user || data, message: 'Login successful' };
  } catch (error) {
    console.error('Login error:', error);
    return { error: 'Network error during login' };
  }
}

/**
 * Register new user
 */
export async function register(data: RegisterData): Promise<AuthResponse> {
  try {
    const response = await fetch(getAuthUrl('/api/accounts/register/'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      return { error: error.message || 'Registration failed' };
    }

    const result = await response.json();
    return { user: result.user || result, message: 'Registration successful' };
  } catch (error) {
    console.error('Registration error:', error);
    return { error: 'Network error during registration' };
  }
}

/**
 * Get current user profile
 */
export async function getProfile(): Promise<User | null> {
  try {
    const response = await fetch(getAuthUrl('/api/accounts/profile/'), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.user || data;
  } catch (error) {
    console.error('Get profile error:', error);
    return null;
  }
}

/**
 * Logout user
 */
export async function logout(): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch(getAuthUrl('/api/accounts/logout/'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      return { success: false, message: 'Logout failed' };
    }

    return { success: true, message: 'Logout successful' };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, message: 'Network error during logout' };
  }
}

/**
 * Check if user is authenticated (by checking session cookie)
 */
export function isAuthenticated(): boolean {
  if (typeof document === 'undefined') return false; // SSR
  
  const cookies = document.cookie.split(';');
  return cookies.some(cookie => cookie.trim().startsWith('sessionid='));
}

/**
 * Google OAuth - Get auth URL
 */
export async function getGoogleAuthUrl(): Promise<string | null> {
  try {
    const response = await fetch(getAuthUrl('/api/accounts/google/'), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.auth_url || data.url || null;
  } catch (error) {
    console.error('Google OAuth error:', error);
    return null;
  }
}

/**
 * Redirect to Google OAuth
 */
export async function loginWithGoogle(): Promise<void> {
  const authUrl = await getGoogleAuthUrl();
  if (authUrl) {
    window.location.href = authUrl;
  } else {
    console.error('Failed to get Google OAuth URL');
  }
}

