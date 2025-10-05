/**
 * 🎯 ЦЕНТРАЛИЗОВАННАЯ КОНФИГУРАЦИЯ НАВИГАЦИИ
 * 
 * Единая точка управления всеми продуктами и навигацией
 * Изменения здесь автоматически применяются ко всем проектам
 */

import { LucideIcon } from 'lucide-react';

// ====================================================================
// ТИПЫ
// ====================================================================

export interface Product {
  id: string;
  name: string;
  url: string;
  enabled: boolean;
  icon: string; // Lucide icon name
  order: number;
  description?: string;
  children?: SubPage[];
}

export interface SubPage {
  id: string;
  name: string;
  path: string; // Relative path within product
  icon: string;
  enabled: boolean;
}

// ====================================================================
// КОНФИГУРАЦИЯ ПРОДУКТОВ
// ====================================================================

/**
 * 🚨 ВАЖНО: Изменяйте только здесь!
 * - enabled: false → продукт скрыт везде
 * - order: меняет порядок отображения
 * - url: будет обновлен после настройки Ngrok
 */
export const PRODUCTS: Product[] = [
  {
    id: 'marketplace',
    name: 'Marketplace',
    url: 'http://localhost:8080/marketplace',
    enabled: true,
    icon: 'Store',
    order: 1,
    description: 'NFT Marketplace',
    children: [
      { id: 'home', name: 'Home', path: '/', icon: 'Home', enabled: true },
      { id: 'popular', name: 'Popular', path: '/popular', icon: 'TrendingUp', enabled: true },
      { id: 'new', name: 'New & Noteworthy', path: '/new', icon: 'Sparkles', enabled: true },
      { id: 'watchlist', name: 'Watchlist', path: '/watchlist', icon: 'Eye', enabled: true },
      { id: 'my-collection', name: 'My Collection', path: '/my-collection', icon: 'FolderHeart', enabled: true },
    ],
  },
  {
    id: 'social',
    name: 'Social Network',
    url: 'http://localhost:8080/social',
    enabled: true,
    icon: 'Users',
    order: 2,
    description: 'Social Network',
    children: [
      { id: 'feed', name: 'Feed', path: '/', icon: 'Home', enabled: true },
      { id: 'popular', name: 'Popular', path: '/popular', icon: 'TrendingUp', enabled: true },
      { id: 'my-page', name: 'My Page', path: '/my-page', icon: 'User', enabled: true },
    ],
  },
  {
    id: 'stocks',
    name: 'Stocks',
    url: 'http://localhost:8080/stocks',
    enabled: true,
    icon: 'TrendingUp',
    order: 3,
    description: 'Stock Trading',
    children: [
      { id: 'home', name: 'Home', path: '/', icon: 'Home', enabled: true },
      { id: 'stocks', name: 'Stocks', path: '/stocks', icon: 'LineChart', enabled: true },
      { id: 'etf', name: 'ETF', path: '/etf', icon: 'Package', enabled: true },
      { id: 'portfolio', name: 'Portfolio', path: '/portfolio', icon: 'Briefcase', enabled: true },
    ],
  },
  {
    id: 'crypto',
    name: 'Cryptocurrency',
    url: 'http://localhost:8080/crypto',
    enabled: true,
    icon: 'Bitcoin',
    order: 4,
    description: 'Crypto Trading',
    children: [
      { id: 'home', name: 'Home', path: '/home', icon: 'Home', enabled: true },
      { id: 'categories', name: 'Categories', path: '/categories', icon: 'Grid', enabled: true },
      { id: 'watchlist', name: 'Watchlist', path: '/watchlist', icon: 'Eye', enabled: true },
      { id: 'portfolio', name: 'Portfolio', path: '/portfolio', icon: 'Briefcase', enabled: true },
    ],
  },
  {
    id: 'stream',
    name: 'Live Streaming',
    url: 'http://localhost:8080/stream',
    enabled: true,
    icon: 'Radio',
    order: 5,
    description: 'Live Streaming Platform',
    children: [
      { id: 'home', name: 'Home', path: '/', icon: 'Home', enabled: true },
      { id: 'following', name: 'Following', path: '/following', icon: 'Users', enabled: true },
      { id: 'browse', name: 'Browse', path: '/browse', icon: 'Search', enabled: true },
    ],
  },
  {
    id: 'ai',
    name: 'AI Assistant',
    url: 'http://localhost:8080/ai',
    enabled: true,
    icon: 'Bot',
    order: 6,
    description: 'AI Trading Assistant',
    children: [
      { id: 'home', name: 'Home', path: '/', icon: 'Home', enabled: true },
      { id: 'dashboard', name: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard', enabled: true },
      { id: 'profile', name: 'Profile', path: '/profile', icon: 'User', enabled: true },
      { id: 'settings', name: 'Settings', path: '/settings', icon: 'Settings', enabled: true },
      { id: 'billing', name: 'Billing', path: '/billing', icon: 'CreditCard', enabled: true },
      { id: 'api', name: 'API', path: '/api', icon: 'Code', enabled: true },
    ],
  },
  {
    id: 'portfolios',
    name: 'My Portfolios',
    url: 'http://localhost:8080/portfolios',
    enabled: true,
    icon: 'FolderKanban',
    order: 7,
    description: 'Portfolio Management',
    children: [
      { id: 'home', name: 'Home', path: '/', icon: 'Home', enabled: true },
      { id: 'calendar', name: 'Calendar', path: '/calendar', icon: 'Calendar', enabled: true },
    ],
  },
  {
    id: 'portfolios2',
    name: 'Portfolios 2',
    url: 'http://localhost:8080/portfolios',
    enabled: true,
    icon: 'FolderKanban',
    order: 8,
    description: 'Portfolio Management (Alt)',
    children: [
      { id: 'home', name: 'Home', path: '/', icon: 'Home', enabled: true },
      { id: 'calendar', name: 'Calendar', path: '/calendar', icon: 'Calendar', enabled: true },
    ],
  },
];

// ====================================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ====================================================================

/**
 * Получить только активные (enabled) продукты, отсортированные по order
 */
export const getEnabledProducts = (): Product[] => {
  return PRODUCTS.filter((p) => p.enabled).sort((a, b) => a.order - b.order);
};

/**
 * Получить продукт по ID
 */
export const getProductById = (id: string): Product | undefined => {
  return PRODUCTS.find((p) => p.id === id);
};

/**
 * Получить активные subpages для продукта
 */
export const getEnabledSubPages = (productId: string): SubPage[] => {
  const product = getProductById(productId);
  if (!product || !product.children) return [];
  return product.children.filter((sp) => sp.enabled);
};

/**
 * Проверить, активен ли продукт
 */
export const isProductEnabled = (id: string): boolean => {
  const product = getProductById(id);
  return product?.enabled ?? false;
};

/**
 * Получить полный URL страницы
 */
export const getPageUrl = (productId: string, pageId: string): string => {
  const product = getProductById(productId);
  if (!product) return '#';
  
  const page = product.children?.find((p) => p.id === pageId);
  if (!page) return product.url;
  
  return `${product.url}${page.path}`;
};

// ====================================================================
// ЭКСПОРТ ДЛЯ ОБРАТНОЙ СОВМЕСТИМОСТИ
// ====================================================================

export default {
  PRODUCTS,
  getEnabledProducts,
  getProductById,
  getEnabledSubPages,
  isProductEnabled,
  getPageUrl,
};

// ====================================================================
// ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ
// ====================================================================

/**
 * ПРИМЕР 1: Отобразить все активные продукты в сайдбаре
 * 
 * import { getEnabledProducts } from '@/config/navigation.config';
 * 
 * const products = getEnabledProducts();
 * products.map(product => (
 *   <NavItem key={product.id} href={product.url}>
 *     {product.name}
 *   </NavItem>
 * ))
 */

/**
 * ПРИМЕР 2: Отобразить subpages продукта
 * 
 * import { getEnabledSubPages, getPageUrl } from '@/config/navigation.config';
 * 
 * const subpages = getEnabledSubPages('marketplace');
 * subpages.map(page => (
 *   <NavItem key={page.id} href={getPageUrl('marketplace', page.id)}>
 *     {page.name}
 *   </NavItem>
 * ))
 */

/**
 * ПРИМЕР 3: Отключить продукт
 * 
 * // В navigation.config.ts:
 * {
 *   id: 'crypto',
 *   enabled: false,  // ← Продукт скрыт везде
 *   ...
 * }
 */

/**
 * ПРИМЕР 4: Изменить порядок продуктов
 * 
 * // В navigation.config.ts:
 * {
 *   id: 'marketplace',
 *   order: 1,  // ← Будет первым
 *   ...
 * }
 * {
 *   id: 'social',
 *   order: 2,  // ← Будет вторым
 *   ...
 * }
 */

