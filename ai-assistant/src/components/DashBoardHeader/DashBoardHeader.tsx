'use client';
import { FC, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import LiveStreaming from '@/assets/Navbar/LiveStreaming.svg';
import Portfolios from '@/assets/Navbar/Portfolios.svg';
import SocialNetwork from '@/assets/Navbar/SocialNetwork.svg';
import MarketPlace from '@/assets/Navbar/MarketPlace.svg';
import { NavItem } from '../ui/Navbar/Navbar';

const navItems: (NavItem & { href: string })[] = [
  {
    id: '14',
    label: 'Marketplace',
    icon: <MarketPlace />,
    href: '/dashboard',
  },
  {
    id: '15',
    label: 'Live Streaming',
    icon: <LiveStreaming />,
    href: '/live-streaming',
  },
  {
    id: '13',
    label: 'Social Network',
    icon: <SocialNetwork />,
    href: '/dashboard',
  },
  { id: '17', label: 'Portfolios', icon: <Portfolios />, href: '/dashboard' },
];

export const DashBoardHeader: FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (pathname === '/dashboard') {
      setActiveId('');
      return;
    }

    const activeItem = navItems.find((item) => pathname.startsWith(item.href));

    if (activeItem) {
      setActiveId(activeItem.id);
    }
  }, [pathname]);


  return (
    <section className='border-b-[2px] border-b-regaliaPurple flex px-6 py-[21px] items-center justify-start'>
      <h2 className='text-2xl font-bold'>Dashboard</h2>
      <div className='ml-[calc(100vw-67vw)] flex items-center gap-6 text-lighterAluminum'>
        {navItems.map(({ id, label, icon, href }) => {
          const isActive = activeId === id;
          return (
            <button
              key={id}
              onClick={() => router.push(href)}
              className='flex flex-col items-center justify-start focus:outline-none'
            >
              <span
                className={isActive ? 'text-purple' : 'text-lighterAluminum'}
              >
                {icon}
              </span>
              <p
                className={`text-[15px] font-bold ${
                  isActive ? 'text-purple' : 'text-lighterAluminum'
                }`}
              >
                {label}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
};
