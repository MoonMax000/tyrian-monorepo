'use client';

import { Tab, TabsNavigationProps } from './interfaces';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import clsx from 'clsx';
import { useEffect } from 'react';

const TabsNavigation: React.FC<
  TabsNavigationProps & { children?: React.ReactNode; offsetLeft?: string }
> = ({ tabs, className, children, offsetLeft = '0px' }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const tab = searchParams.get('tab') || tabs[0]?.tab;

  useEffect(() => {
    if (!searchParams.get('tab')) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('tab', tabs[0]?.tab || '');
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [searchParams, router, pathname, tabs]);

  return (
    <div className='relative w-full'>
      <div
        className={clsx('absolute top-[58px] right-px h-[2px] bg-webGray opacity-[24%]', className)}
        style={{ left: offsetLeft }}
      />
      <div className={`relative flex gap-6 pt-6  ${className}`}>
        {tabs.map((item, index) => (
          <TabItem
            key={index}
            item={item}
            isActive={item.tab === tab}
            pathname={pathname}
            searchParams={searchParams}
          />
        ))}
      </div>
      {children && <div className='mt-4'>{children}</div>}

      <div className='mt-4'>{tabs.find((item) => item.tab === tab)?.content || null}</div>
    </div>
  );
};

export default TabsNavigation;

type TabItemType = {
  item: Tab;
  isActive: boolean;
  pathname: string;
  searchParams: URLSearchParams;
};

function TabItem({ item, isActive, pathname, searchParams }: TabItemType) {
  const router = useRouter();

  const handleTabClick = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', item.tab || '');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div
      onClick={handleTabClick}
      className={clsx('relative cursor-pointer pt-0 pb-2 pl-4 transition-all text-tabs', {
        'text-purple': isActive,
        'text-[#808283] hover:text-purple': !isActive,
      })}
    >
      {item.label}
      {isActive && <div className='absolute bottom-0 inset-x-0 h-1 bg-purple w-[108%]' />}
    </div>
  );
}
