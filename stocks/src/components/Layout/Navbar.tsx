'use client';

import { useEffect, useState } from 'react';
import { Dispatch, SetStateAction } from 'react';

import Menu from '@/components/UI/Menu';

import IconHome from '@/assets/icons/navbar/icon-home.svg';
import IconChart from '@/assets/icons/navbar/icon-chart.svg';
import IconCalendar from '@/assets/icons/navbar/icon-calendar.svg';
import IconPlanet from '@/assets/icons/navbar/icon-planet.svg';
import IconCase from '@/assets/icons/navbar/icon-case.svg';
import IconResearch from '@/assets/icons/navbar/icon-research.svg';
import IconArrow from '@/assets/icons/navbar/icon-arrow.svg';
import IconWallet from '@/assets/icons/navbar/icon-wallet.svg';
import IconMenu from '@/assets/icons/navbar/menu.svg';

import IconCmc from '@/assets/icons/navbar/icon-cmc.svg';
import IconTerminal from '@/assets/icons/navbar/icon-terminal.svg';
import IconSocialWeb from '@/assets/icons/navbar/icon-socialweb.svg';
import IconAi from '@/assets/icons/navbar/icon-ai.svg';
import IconMarketplace from '@/assets/icons/navbar/icon-marketplace.svg';
import IconStream from '@/assets/icons/navbar/icon-stream.svg';

const menuTop = [
  { label: 'Home', href: '/', icon: <IconHome /> },
  { label: 'Stock Screener', href: '/stocks-comparison', icon: <IconChart /> },
  { label: 'Dividend calendar', href: '/dividends-schedule', icon: <IconWallet /> },
  { label: 'Events calendar', href: '/events-calendar', icon: <IconCalendar /> },
  { label: 'Markets', href: '/market-news', icon: <IconPlanet /> },
  { label: 'Portfolios', href: '/portfolios', icon: <IconCase /> },
  { label: 'Research', href: '/research', icon: <IconResearch /> },
  { label: 'Crypto', href: '/crypto-currency', icon: <IconChart /> },
];

const menuBottom = [
  { label: 'CoinMarketCap', icon: <IconCmc />, href: 'https://cmc.tyriantrade.com/' },
  {
    label: 'Trading Terminal',
    icon: <IconTerminal />,
    href: '#',
    disabled: true,
  },
  { label: 'Social Network', icon: <IconSocialWeb />, href: 'https://socialweb.tyriantrade.com/' },
  { label: 'Live Streaming', icon: <IconStream />, href: 'https://streaming.tyriantrade.com/' },
  { label: 'Marketplace', icon: <IconMarketplace />, href: 'https://market.tyriantrade.com' },
  { label: 'Portfolios', href: 'https://stocks.tyriantrade.com/portfolios', icon: <IconCase /> },
  { label: 'AI Assistant', icon: <IconAi />, href: 'https://aihelp.tyriantrade.com/' },
];

type Props = {
  isCollapsed: boolean;
  setIsCollapsed: Dispatch<SetStateAction<boolean>>;
};

export function Navbar({ isCollapsed, setIsCollapsed }: Props) {
  const [showText, setShowText] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isCollapsed) {
      setShowText(false);
    } else {
      timeout = setTimeout(() => setShowText(true), 100);
    }
    return () => clearTimeout(timeout);
  }, [isCollapsed]);

  const toggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside
      className={`${
        isCollapsed ? 'w-[50px]' : 'w-fit'
      } transition-all duration-300 text-white min-h-screen flex flex-col border-r-[2px] border-onyxGrey relative`}
    >
      <button
        onClick={toggle}
        className={`absolute top-10 transition-all duration-300 ${
          isCollapsed ? 'left-[50%]' : 'left-[90%]'
        } w-12 h-12 border border-onyxGrey bg-[#0c1014] rounded-[12px] flex items-center justify-center hover:bg-[#2a2b2e] z-50`}
      >
        {isCollapsed ? <IconMenu /> : <IconArrow />}
      </button>

      <div className='flex flex-col py-4  pl-6 gap-4'>
        {showText && <Menu menuList={menuTop} />}
        {showText && <div className='bg-onyxGrey h-[2px]' />}
        {showText && <Menu menuList={menuBottom} />}
      </div>
    </aside>
  );
}
