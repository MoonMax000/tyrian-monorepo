'use client';

import { FC, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Home,
  TrendingUp,
  Bitcoin,
  Users,
  ShoppingBag,
  Video,
  Bot,
  Calendar,
  FolderKanban,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface NavElementProps {
  icon: React.ReactNode;
  title: string;
  route?: string;
  children?: NavElementProps[];
}

const navElements: NavElementProps[] = [
  { icon: <Home className="h-5 w-5" />, title: 'Home', route: '/' },
  {
    icon: <TrendingUp className="h-5 w-5" />,
    title: 'Stock Market',
    route: '/',
    children: [
      { icon: <Home className="h-4 w-4" />, title: 'Home', route: '/' },
      { icon: <TrendingUp className="h-4 w-4" />, title: 'Crypto Currency', route: '/crypto-currency' },
      { icon: <TrendingUp className="h-4 w-4" />, title: 'Portfolios', route: '/portfolios' },
      { icon: <TrendingUp className="h-4 w-4" />, title: 'My Portfolios', route: '/my-portfolios' },
      { icon: <Calendar className="h-4 w-4" />, title: 'Dividends Schedule', route: '/dividends-schedule' },
      { icon: <Calendar className="h-4 w-4" />, title: 'Events Calendar', route: '/events-calendar' },
      { icon: <TrendingUp className="h-4 w-4" />, title: 'Market News', route: '/market-news' },
      { icon: <TrendingUp className="h-4 w-4" />, title: 'Research', route: '/research' },
      { icon: <TrendingUp className="h-4 w-4" />, title: 'Stocks Comparison', route: '/stocks-comparison' },
      { icon: <TrendingUp className="h-4 w-4" />, title: 'Volatility', route: '/volatility' },
      { icon: <TrendingUp className="h-4 w-4" />, title: 'Volume', route: '/volume' },
      { icon: <Users className="h-4 w-4" />, title: 'Profile', route: '/profile' },
    ],
  },
  {
    icon: <Bitcoin className="h-5 w-5" />,
    title: 'Cryptocurrency',
    route: 'http://localhost:3003',
    children: [
      { icon: <Home className="h-4 w-4" />, title: 'Home', route: 'http://localhost:3003/' },
      { icon: <Bitcoin className="h-4 w-4" />, title: 'All Crypto', route: 'http://localhost:3003/crypto' },
      { icon: <Bitcoin className="h-4 w-4" />, title: 'Portfolios', route: 'http://localhost:3003/portfolios' },
      { icon: <TrendingUp className="h-4 w-4" />, title: 'Gainers & Losers', route: 'http://localhost:3003/gainers-and-losers' },
      { icon: <TrendingUp className="h-4 w-4" />, title: 'Recently Added', route: 'http://localhost:3003/recently-added' },
      { icon: <Calendar className="h-4 w-4" />, title: 'Calendar', route: 'http://localhost:3003/calendar' },
      { icon: <TrendingUp className="h-4 w-4" />, title: 'Market News', route: 'http://localhost:3003/market-news' },
      { icon: <Users className="h-4 w-4" />, title: 'Profile', route: 'http://localhost:3003/profile' },
    ],
  },
  {
    icon: <Users className="h-5 w-5" />,
    title: 'Social Network',
    route: 'http://localhost:3001',
    children: [
      { icon: <Users className="h-4 w-4" />, title: 'Feed (Home)', route: 'http://localhost:3001/' },
      { icon: <TrendingUp className="h-4 w-4" />, title: 'Popular', route: 'http://localhost:3001/popular' },
      { icon: <TrendingUp className="h-4 w-4" />, title: 'New', route: 'http://localhost:3001/new' },
      { icon: <Users className="h-4 w-4" />, title: 'Discussed', route: 'http://localhost:3001/discussed' },
      { icon: <Users className="h-4 w-4" />, title: 'Favorites', route: 'http://localhost:3001/favorites' },
      { icon: <Users className="h-4 w-4" />, title: 'For Us', route: 'http://localhost:3001/for-us' },
      { icon: <Users className="h-4 w-4" />, title: 'Ideas', route: 'http://localhost:3001/ideas' },
      { icon: <Users className="h-4 w-4" />, title: 'Scripts', route: 'http://localhost:3001/scripts' },
      { icon: <Users className="h-4 w-4" />, title: 'Videos', route: 'http://localhost:3001/video' },
      { icon: <Users className="h-4 w-4" />, title: 'Chats', route: 'http://localhost:3001/chats' },
      { icon: <Users className="h-4 w-4" />, title: 'Settings', route: 'http://localhost:3001/settings' },
    ],
  },
  {
    icon: <ShoppingBag className="h-5 w-5" />,
    title: 'Marketplace',
    children: [
      {
        icon: <Home className="h-4 w-4" />,
        title: 'Home',
        route: '/',
      },
      {
        icon: <ShoppingBag className="h-4 w-4" />,
        title: 'All Products',
        route: '/all-tab',
      },
      {
        icon: <TrendingUp className="h-4 w-4" />,
        title: 'Popular',
        route: '/popular-tab',
      },
      {
        icon: <ShoppingBag className="h-4 w-4" />,
        title: 'Favorites',
        route: '/favorites-tab',
      },
      {
        icon: <ShoppingBag className="h-4 w-4" />,
        title: 'Strategies',
        route: '/strategies-tab',
      },
      {
        icon: <ShoppingBag className="h-4 w-4" />,
        title: 'Scripts',
        route: '/scripts-tab',
      },
      {
        icon: <ShoppingBag className="h-4 w-4" />,
        title: 'Courses',
        route: '/courses-tab',
      },
      {
        icon: <TrendingUp className="h-4 w-4" />,
        title: 'Signals',
        route: '/signals',
      },
      {
        icon: <Bot className="h-4 w-4" />,
        title: 'Robots',
        route: '/robots-tab',
      },
      {
        icon: <Users className="h-4 w-4" />,
        title: 'Analysts',
        route: '/analystys-tab',
      },
      {
        icon: <Users className="h-4 w-4" />,
        title: 'Consultants',
        route: '/consultants-tab',
      },
      {
        icon: <Users className="h-4 w-4" />,
        title: 'Traders',
        route: '/traders-tab',
      },
      {
        icon: <ShoppingBag className="h-4 w-4" />,
        title: 'Others',
        route: '/others-tab',
      },
      {
        icon: <ShoppingBag className="h-4 w-4" />,
        title: 'Trading Card',
        route: '/trading-card',
      },
      {
        icon: <FolderKanban className="h-4 w-4" />,
        title: 'Portfolios',
        route: '/portfolios',
      },
      {
        icon: <ShoppingBag className="h-4 w-4" />,
        title: 'Create Product',
        route: '/create-product',
      },
      {
        icon: <Users className="h-4 w-4" />,
        title: 'My Profile',
        route: '/profile',
      },
    ],
  },
  {
    icon: <Video className="h-5 w-5" />,
    title: 'Live Streaming',
    route: 'http://localhost:3004',
    children: [
      { icon: <Home className="h-4 w-4" />, title: 'Home', route: 'http://localhost:3004/' },
      { icon: <Video className="h-4 w-4" />, title: 'Recommended', route: 'http://localhost:3004/recommended' },
      { icon: <Video className="h-4 w-4" />, title: 'Following', route: 'http://localhost:3004/following' },
      { icon: <Video className="h-4 w-4" />, title: 'Browse Streams', route: 'http://localhost:3004/browse' },
      { icon: <Video className="h-4 w-4" />, title: 'My Channel', route: 'http://localhost:3004/channel' },
      { icon: <Users className="h-4 w-4" />, title: 'Profile', route: 'http://localhost:3004/profile' },
    ],
  },
  {
    icon: <Bot className="h-5 w-5" />,
    title: 'AI Assistant',
    route: 'http://localhost:3006',
    children: [
      { icon: <Home className="h-4 w-4" />, title: 'Home', route: 'http://localhost:3006/' },
      { icon: <Bot className="h-4 w-4" />, title: 'Dashboard', route: 'http://localhost:3006/dashboard' },
      { icon: <Bot className="h-4 w-4" />, title: 'Profile', route: 'http://localhost:3006/profile' },
      { icon: <Bot className="h-4 w-4" />, title: 'Settings', route: 'http://localhost:3006/settings' },
      { icon: <Bot className="h-4 w-4" />, title: 'Security', route: 'http://localhost:3006/security' },
      { icon: <Bot className="h-4 w-4" />, title: 'Billing', route: 'http://localhost:3006/billing' },
      { icon: <Bot className="h-4 w-4" />, title: 'Referrals', route: 'http://localhost:3006/referrals' },
      { icon: <Bot className="h-4 w-4" />, title: 'API', route: 'http://localhost:3006/api' },
    ],
  },
  {
    icon: <Calendar className="h-5 w-5" />,
    title: 'Calendar',
    route: 'http://localhost:3005/calendar',
  },
  {
    icon: <FolderKanban className="h-5 w-5" />,
    title: 'My Portfolios',
    route: 'http://localhost:3005/portfolios',
  },
  {
    icon: <FolderKanban className="h-5 w-5" />,
    title: 'Portfolios 2',
    route: 'http://localhost:5173',
  },
];

export const NewSidebar: FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const pathname = usePathname();

  const toggleGroup = (title: string) =>
    setOpenGroup(openGroup === title ? null : title);

  const isExternalUrl = (route: string) => route.startsWith('http://') || route.startsWith('https://');

  const renderElement = (el: NavElementProps) => {
    if (el.children && el.children.length > 0) {
      const isOpen = openGroup === el.title;
      return (
        <div key={el.title}>
          <button
            onClick={() => toggleGroup(el.title)}
            className={cn(
              'flex items-center justify-between w-full px-3 py-[14px] rounded-lg transition',
            )}
            aria-expanded={isOpen}
          >
            <div
              className={cn(
                'flex items-center gap-2 pl-2 hover:text-white hover:border-l-[2px] hover:border-purple overflow-hidden',
                {
                  'text-white border-l-[2px] border-purple': isOpen,
                  'text-[#B0B0B0]': !isOpen,
                  'ml-[5px]': isCollapsed,
                },
              )}
            >
              <div className="size-5 flex-shrink-0">{el.icon}</div>
              <span
                className={cn(
                  'text-[15px] font-semibold whitespace-nowrap transition-all duration-300',
                  {
                    'opacity-0 w-0': isCollapsed,
                    'opacity-100 w-auto': !isCollapsed,
                  },
                )}
              >
                {el.title}
              </span>
            </div>
            {!isCollapsed && (
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform flex-shrink-0',
                  isOpen && 'rotate-180',
                )}
              />
            )}
          </button>
          {isOpen && !isCollapsed && (
            <div className="ml-6 flex flex-col gap-1">
              {el.children.map((child) => {
                const isActive = pathname === child.route;
                const isExternal = child.route && isExternalUrl(child.route);
                
                if (isExternal) {
                  return (
                    <a
                      key={child.title}
                      href={child.route}
                      className={cn('px-3')}
                    >
                      <div
                        className={cn(
                          'flex items-center gap-2 pl-2 py-2 hover:custom-bg-blur hover:text-white hover:border-l-[2px] hover:border-purple overflow-hidden',
                          isActive ? 'text-white' : 'text-[#B0B0B0]',
                        )}
                      >
                        <div className="size-5 flex-shrink-0">{child.icon}</div>
                        <span className="text-[15px] font-semibold whitespace-nowrap">
                          {child.title}
                        </span>
                      </div>
                    </a>
                  );
                }

                return (
                  <Link
                    key={child.title}
                    href={child.route ?? '#'}
                    className={cn('px-3')}
                  >
                    <div
                      className={cn(
                        'flex items-center gap-2 pl-2 py-2 hover:custom-bg-blur hover:text-white hover:border-l-[2px] hover:border-purple overflow-hidden',
                        isActive ? 'text-white' : 'text-[#B0B0B0]',
                      )}
                    >
                      <div className="size-5 flex-shrink-0">{child.icon}</div>
                      <span className="text-[15px] font-semibold whitespace-nowrap">
                        {child.title}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    if (el.route) {
      const isActive = pathname === el.route;
      const isExternal = isExternalUrl(el.route);

      if (isExternal) {
        return (
          <a
            key={el.title}
            href={el.route}
            className={cn('px-3 py-[14px]', { 'ml-[5px]': isCollapsed })}
          >
            <div
              className={cn(
                'flex items-center gap-2 pl-2 transition hover:text-white hover:border-l-[2px] hover:border-purple overflow-hidden',
                isActive ? 'text-white' : 'text-[#B0B0B0]',
              )}
            >
              <div className="size-5 flex-shrink-0">{el.icon}</div>
              <span
                className={cn(
                  'text-[15px] font-semibold whitespace-nowrap transition-all duration-300',
                  {
                    'opacity-0 w-0': isCollapsed,
                    'opacity-100 w-auto': !isCollapsed,
                  },
                )}
              >
                {el.title}
              </span>
            </div>
          </a>
        );
      }

      return (
        <Link
          key={el.title}
          href={el.route}
          className={cn('px-3 py-[14px]', { 'ml-[5px]': isCollapsed })}
        >
          <div
            className={cn(
              'flex items-center gap-2 pl-2 transition hover:text-white hover:border-l-[2px] hover:border-purple overflow-hidden',
              isActive ? 'text-white' : 'text-[#B0B0B0]',
            )}
          >
            <div className="size-5 flex-shrink-0">{el.icon}</div>
            <span
              className={cn(
                'text-[15px] font-semibold whitespace-nowrap transition-all duration-300',
                {
                  'opacity-0 w-0': isCollapsed,
                  'opacity-100 w-auto': !isCollapsed,
                },
              )}
            >
              {el.title}
            </span>
          </div>
        </Link>
      );
    }

    return (
      <div
        key={el.title}
        className={cn('px-3 py-[14px]', { 'ml-[5px]': isCollapsed })}
      >
        <div className="flex items-center gap-2 pl-2 text-[#B0B0B0] hover:text-white hover:border-l-[2px] hover:border-purple overflow-hidden">
          <div className="size-5 flex-shrink-0">{el.icon}</div>
          <span
            className={cn(
              'text-[15px] font-semibold whitespace-nowrap transition-all duration-300',
              {
                'opacity-0 w-0': isCollapsed,
                'opacity-100 w-auto': !isCollapsed,
              },
            )}
          >
            {el.title}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="relative mt-8 ml-8 hidden lg:block z-20">
      <div
        className={cn(
          'bg-transparent relative h-fit rounded-[12px] p-[1px] w-fit',
          'bg-transparent',
        )}
      >
        <div
          className={cn(
            'flex flex-col py-4 transition-all duration-300 custom-bg-blur rounded-[12px]',
            isCollapsed ? 'w-[72px]' : 'w-[222px]',
          )}
        >
          <div className="absolute right-[-12px] top-[14px]">
            <button
              className="w-[26px] h-[26px] rounded-[12px] border border-white/10 custom-bg-blur hover:bg-white/10 flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md z-20"
              onClick={() => setIsCollapsed(!isCollapsed)}
              aria-label="Toggle compact menu"
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
          </div>

          <div className="flex flex-col gap-1">
            {navElements.slice(0, 1).map((el) => renderElement(el))}
            <div
              className={cn(
                'my-[14px] bg-[linear-gradient(90deg,rgba(82,58,131,0)_0%,#523A83_50%,rgba(82,58,131,0)_100%)] mx-auto h-[2px] transition-all duration-300',
                {
                  'w-[190px]': !isCollapsed,
                  'w-[40px]': isCollapsed,
                },
              )}
            />
            {navElements.slice(1).map((el) => renderElement(el))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewSidebar;

