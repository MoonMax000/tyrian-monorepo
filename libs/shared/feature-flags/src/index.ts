/**
 * Feature Flags System for Tyrian Platform
 * 
 * Управляет доступностью продуктов через environment variables.
 */

// Re-export all feature flags functionality
export interface Product {
  id: string;
  name: string;
  enabled: boolean;
  url?: string;
}

export const getFeatureFlags = (): Product[] => {
  return [
    { id: 'marketplace', name: 'Marketplace', enabled: true, url: '/marketplace' },
    { id: 'crypto', name: 'Crypto', enabled: true, url: '/crypto' },
    { id: 'stocks', name: 'Stocks', enabled: true, url: '/stocks' },
    { id: 'social', name: 'Social', enabled: true, url: '/social' },
    { id: 'ai-assistant', name: 'AI Assistant', enabled: true, url: '/ai-assistant' },
    { id: 'portfolios', name: 'Portfolios', enabled: true, url: '/portfolios' },
  ];
};

export const getProducts = getFeatureFlags;

export const isProductEnabled = (productId: string): boolean => {
  const products = getFeatureFlags();
  const product = products.find(p => p.id === productId);
  return product?.enabled ?? false;
};

export const getEnabledProductUrls = (): string[] => {
  return getFeatureFlags()
    .filter(p => p.enabled && p.url)
    .map(p => p.url!);
};
