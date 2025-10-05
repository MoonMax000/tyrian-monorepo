/**
 * Shared TypeScript types for Tyrian Platform
 */

export interface User {
  id: string;
  email: string;
  username?: string;
  avatar?: string;
  firstName?: string;
  lastName?: string;
  isAuthenticated: boolean;
}

export interface NavElement {
  icon: React.ReactNode;
  title: string;
  route?: string;
  children?: NavElement[];
}

export interface Product {
  id: string;
  name: string;
  url: string;
  enabled: boolean;
  icon: string;
  order: number;
  description?: string;
  children?: Array<{
    name: string;
    url: string;
  }>;
}

export interface FeatureFlags {
  MARKETPLACE: boolean;
  SOCIAL: boolean;
  STOCKS: boolean;
  CRYPTO: boolean;
  STREAM: boolean;
  AI: boolean;
  PORTFOLIOS: boolean;
}

