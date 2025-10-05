'use client';
import clsx from 'clsx';
import Link from 'next/link';
import { useSidebar } from './SidebarContext';

import Arrow from '@/assets/sidebar/button/arrow.svg';
import Burger from '@/assets/sidebar/button/burger.svg';

import Ai from '@/assets/sidebar/items/ai.svg';
import Bitcoin from '@/assets/sidebar/items/bitcoin.svg';
import Calendar from '@/assets/sidebar/items/calendar.svg';
import Home from '@/assets/sidebar/items/home.svg';
import Marketplace from '@/assets/sidebar/items/marketplace.svg';
import Social from '@/assets/sidebar/items/social.svg';
import Stocks from '@/assets/sidebar/items/stocks.svg';
import Streaming from '@/assets/sidebar/items/streaming.svg';
import Traders from '@/assets/sidebar/items/traders.svg';
import Trading from '@/assets/sidebar/items/trading.svg';
import Wallet from '@/assets/sidebar/items/wallet.svg';

const CMC_URL = process.env.NEXT_PUBLIC_COINMARKETCAP_URL;
const SOCIAL_URL = process.env.NEXT_PUBLIC_SOCIAL_NETWORK_URL;
const STREAMING_URL = process.env.NEXT_PUBLIC_STREAMING_URL;
const AI_URL = process.env.NEXT_PUBLIC_AI_ASSISTANT_URL;
const PORTFOLIO_URL = process.env.NEXT_PUBLIC_PORTFOLIO_URL;
const MARKETPLACE_URL = process.env.NEXT_PUBLIC_MARKETPLACE_URL;
const TRADER_DIARY_URL = process.env.NEXT_PUBLIC_TRADER_DIARY_URL;

interface MenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  dividerAfter?: boolean;
  link?: string;
  disabled?: boolean;
}

const menuItems: MenuItem[] = [
  { id: 'home', title: 'Home', icon: <Home />, link: '/home' },
  { id: 'fear-and-greed', title: 'Fear and Greed', icon: <Stocks />, link: '/fear-and-greed' },
  { id: 'altseason-index', title: 'Altseason Index', icon: <Wallet />, link: '/alt-season' },
  { id: 'btc-dominance', title: 'BTC Dominance', icon: <Calendar />, link: '/btc-dominance' },
  {
    id: 'cryptocurrency',
    title: 'Cryptocurrency',
    icon: <Bitcoin />,
    dividerAfter: true,
    link: '/tracker/eth',
  },
  { id: 'traders-journal', title: "Trader's Journal", icon: <Traders />, link: TRADER_DIARY_URL },
  {
    id: 'trading-terminal',
    title: 'Trading Terminal',
    icon: <Trading />,
    link: CMC_URL,
    disabled: true,
  },
  { id: 'social-network', title: 'Social Network', icon: <Social />, link: SOCIAL_URL },
  { id: 'live-streaming', title: 'Live Streaming', icon: <Streaming />, link: STREAMING_URL },
  { id: 'portfolios', title: 'Portfolios', icon: <Traders />, link: PORTFOLIO_URL },

  { id: 'marketplace', title: 'Marketplace', icon: <Marketplace />, link: MARKETPLACE_URL },
  { id: 'ai-assistant', title: 'AI Assistant', icon: <Ai />, link: AI_URL },
];

export const Sidebar = () => {
  const { isOpen, toggleSidebar } = useSidebar();

  return (
    <div className="absolute h-full left-0 top-0 z-30">
      <div className="relative flex h-full">
        <div
          className="h-full w-[220px] overflow-hidden"
          style={{
            position: 'absolute',
            left: isOpen ? 0 : -220,
            top: 0,
            zIndex: 41,
            transition: 'left 0.3s ease-in-out',
          }}
        >
          <div className="w-[220px] overflow-y-auto py-6">
            <div className="flex flex-col space-y-1 px-3">
              {menuItems.map((item) => (
                <div key={item.id}>
                  {item.link ? (
                    <Link href={item.link}>
                      <div
                        className={clsx(
                          'flex font-bold text-[15px] cursor-pointer items-center rounded-md p-3 text-[#808283] transition-colors hover:text-white',
                          {
                            'cursor-default pointer-events-none opacity-40': item.disabled,
                          }
                        )}
                      >
                        <span className="mr-3 flex h-6 w-6 items-center justify-center">{item.icon}</span>
                        <span className="text-sm">{item.title}</span>
                      </div>
                    </Link>
                  ) : (
                    <div
                      className={clsx(
                        'flex font-bold text-[15px] cursor-default items-center rounded-md p-3 text-[#808283]',
                        {
                          'cursor-default pointer-events-none opacity-40': item.disabled,
                        }
                      )}
                    >
                      <span className="mr-3 flex h-6 w-6 items-center justify-center">{item.icon}</span>
                      <span className="text-sm">{item.title}</span>
                    </div>
                  )}

                  {item.dividerAfter && (
                    <div className="my-3 -mx-3 h-0.5 w-[220px] bg-[#313338]" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="absolute h-full border-r-2 border-[#313338] z-50"
          style={{
            left: isOpen ? '220px' : '50px',
            transition: 'left 0.3s ease-in-out',
          }}
        >
          <button
            onClick={toggleSidebar}
            className="absolute top-6 -right-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#0c1014] border border-[#313338] text-white transition-all hover:bg-[#313338] z-50"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <Arrow /> : <Burger />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
