/**
 * Feature Flags System for Tyrian Platform
 * 
 * Управляет доступностью продуктов через environment variables.
 * Для выключения продукта установите соответствующий флаг в false в .env.local
 * 
 * Example:
 * ```env
 * NEXT_PUBLIC_ENABLE_MARKETPLACE=false
 * ```
 */

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

/**
 * Получить состояния feature flags из environment variables
 */
export function getFeatureFlags(): Record<string, boolean> {
  // Для браузера используем NEXT_PUBLIC_* переменные
  if (typeof window !== 'undefined') {
    return {
      MARKETPLACE: process.env.NEXT_PUBLIC_ENABLE_MARKETPLACE !== 'false',
      SOCIAL: process.env.NEXT_PUBLIC_ENABLE_SOCIAL !== 'false',
      STOCKS: process.env.NEXT_PUBLIC_ENABLE_STOCKS !== 'false',
      CRYPTO: process.env.NEXT_PUBLIC_ENABLE_CRYPTO !== 'false',
      STREAM: process.env.NEXT_PUBLIC_ENABLE_STREAM !== 'false',
      AI: process.env.NEXT_PUBLIC_ENABLE_AI !== 'false',
      PORTFOLIOS: process.env.NEXT_PUBLIC_ENABLE_PORTFOLIOS !== 'false',
    };
  }
  
  // Для SSR (серверных компонентов Next.js)
  return {
    MARKETPLACE: process.env.NEXT_PUBLIC_ENABLE_MARKETPLACE !== 'false',
    SOCIAL: process.env.NEXT_PUBLIC_ENABLE_SOCIAL !== 'false',
    STOCKS: process.env.NEXT_PUBLIC_ENABLE_STOCKS !== 'false',
    CRYPTO: process.env.NEXT_PUBLIC_ENABLE_CRYPTO !== 'false',
    STREAM: process.env.NEXT_PUBLIC_ENABLE_STREAM !== 'false',
    AI: process.env.NEXT_PUBLIC_ENABLE_AI !== 'false',
    PORTFOLIOS: process.env.NEXT_PUBLIC_ENABLE_PORTFOLIOS !== 'false',
  };
}

/**
 * Получить список всех продуктов с учетом feature flags
 * Возвращает только включенные продукты
 */
export function getProducts(): Product[] {
  const flags = getFeatureFlags();
  
  const allProducts: Product[] = [
    {
      id: 'marketplace',
      name: 'Marketplace',
      url: 'http://localhost:8080/marketplace',
      enabled: flags.MARKETPLACE,
      icon: '🏪',
      order: 1,
      description: 'Educational materials marketplace',
      children: [
        { name: 'Popular', url: 'http://localhost:8080/marketplace/popular-tab' },
        { name: 'All Products', url: 'http://localhost:8080/marketplace/all-tab' },
      ],
    },
    {
      id: 'social',
      name: 'Social Network',
      url: 'http://localhost:8080/social',
      enabled: flags.SOCIAL,
      icon: '👥',
      order: 2,
      description: 'Trading social network',
      children: [
        { name: 'Feed', url: 'http://localhost:8080/social/feed' },
        { name: 'My Page', url: 'http://localhost:8080/social/my-page' },
      ],
    },
    {
      id: 'crypto',
      name: 'Cryptocurrency',
      url: 'http://localhost:8080/crypto',
      enabled: flags.CRYPTO,
      icon: '₿',
      order: 3,
      description: 'Cryptocurrency market data',
      children: [
        { name: 'Home', url: 'http://localhost:8080/crypto/home?tab=trends' },
        { name: 'Popular', url: 'http://localhost:8080/crypto/popular' },
      ],
    },
    {
      id: 'stocks',
      name: 'Stocks',
      url: 'http://localhost:8080/stocks',
      enabled: flags.STOCKS,
      icon: '📈',
      order: 4,
      description: 'Stock market data and analysis',
    },
    {
      id: 'stream',
      name: 'Live Streaming',
      url: 'http://localhost:8080/stream',
      enabled: flags.STREAM,
      icon: '📡',
      order: 5,
      description: 'Live trading streams',
    },
    {
      id: 'portfolios',
      name: 'My Portfolios',
      url: 'http://localhost:8080/portfolios',
      enabled: flags.PORTFOLIOS,
      icon: '💼',
      order: 6,
      description: 'Portfolio management',
    },
    {
      id: 'ai',
      name: 'AI Assistant',
      url: 'http://localhost:8080/ai',
      enabled: flags.AI,
      icon: '🤖',
      order: 7,
      description: 'AI trading assistant',
    },
  ];

  // Возвращаем только включенные продукты, отсортированные по order
  return allProducts
    .filter(p => p.enabled)
    .sort((a, b) => a.order - b.order);
}

/**
 * Проверить включен ли конкретный продукт
 */
export function isProductEnabled(productId: string): boolean {
  const flags = getFeatureFlags();
  const key = productId.toUpperCase();
  return flags[key] === true;
}

/**
 * Получить URLs всех включенных продуктов (для навигации)
 */
export function getEnabledProductUrls(): string[] {
  return getProducts().map(p => p.url);
}

