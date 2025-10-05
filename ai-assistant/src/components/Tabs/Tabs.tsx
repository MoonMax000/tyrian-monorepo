'use client';
import React, { FC, ReactNode, Suspense, useEffect } from 'react';
import Tabs from '../ui/TabsSwitcher/TabsSwitcher';
import { usePathname, useRouter } from 'next/navigation';
import DashboardIcon from '@/assets/dashboard.svg';
import ProfileIcon from '@/assets/profile.svg';
import StoreIcon from '@/assets/store.svg';
import StreamIcon from '@/assets/stream.svg';
import CommentsIcon from '@/assets/comments.svg';
import PortfolioIcon from '@/assets/portfolio.svg';

const tabs = [
  {
    key: 'Dashboard',
    value: 'dashboard',
    icon: <DashboardIcon />,
  },
  {
    key: 'Profile',
    value: 'profile',
    icon: <ProfileIcon />,
  },
  {
    key: 'Marketplace',
    value: 'marketplace',
    icon: <StoreIcon />,
  },
  {
    key: 'Live Streaming',
    value: 'live-streaming',
    icon: <StreamIcon />,
  },
  {
    key: 'Social Network',
    value: 'social-network',
    icon: <CommentsIcon />,
  },
  {
    key: 'Portfolios',
    value: 'portfolios',
    icon: <PortfolioIcon />,
  },
];

const defaultIndex = 2;

interface Props {
  children?: ReactNode;
}

export const TabsComponent: FC<Props> = ({ children }) => {
  const { push } = useRouter();
  const pathname = usePathname();

  const tabName = pathname.split('/').pop();

  useEffect(() => {
    if (pathname.endsWith('/profile-tabs')) {
      push(`/profile-tabs/${tabs[defaultIndex].value}`);
    }
  }, []);

  const handleChangeTab = (name: string) => {
    const currentTab = tabs.find((tab) => tab.key === name);
    push(`/profile-tabs/${currentTab?.value ?? '/'}`);
  };

  return (
    <div className='w-full flex flex-col items-center'>
      <div className='flex p-1 bg-[#0C101480] backdrop-blur-[100px] border border-[#181B22] rounded-[36px]'>
        <Tabs
          tabs={tabs.map((item) => item.key)}
          onChange={handleChangeTab}
          icons={tabs.map((tab) => tab.icon)}
          defaultIndex={tabs.findIndex((tab) => tab.value === tabName)}
          className='rounded-[32px] w-fit py-[12px] px-[16px] h-[44px] text-[#B0B0B0]  bg-[#0C101480] backdrop-blur-[117px]'
        />
      </div>
      <Suspense>{children}</Suspense>
    </div>
  );
};
