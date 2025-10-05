'use client';
import { useLayoutEffect } from 'react';
import Tabs from '../ui/TabsSwitcher/TabsSwitcher';
import { useRouter, useSearchParams } from 'next/navigation';
import OverviewIcon from '@/assets/overview.svg';
import BoxIcon from '@/assets/box.svg';
import BagIcon from '@/assets/bag.svg';
import CartIcon from '@/assets/cart.svg';
import GiftIcon from '@/assets/gift.svg';
import StarIcon from '@/assets/star.svg';
import CashIcon from '@/assets/cash.svg';
import ParamsIcon from '@/assets/params.svg';
import MyPurchasesTab from '@/components/MarketplaceTabs/TabsForMarketplace/MyPurchases';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import ReviewsTab from '@/components/MarketplaceTabs/TabsForMarketplace/Reviews';
import SettingsTab from '@/components/MarketplaceTabs/TabsForMarketplace/Settings';
import PayoutsTab from './TabsForMarketplace/Payouts';
import OverviewTab from './TabsForMarketplace/Overview';
import SalesTab from './TabsForMarketplace/Sales';
import { MyProductsTab } from './TabsForMarketplace/MyProducts';

const tabs = [
  {
    key: 'Overview',
    value: 'overview',
    icon: <OverviewIcon />,
  },
  {
    key: 'My Products',
    value: 'my-products',
    icon: <BoxIcon />,
  },
  {
    key: 'Sales',
    value: 'sales',
    icon: <BagIcon />,
  },
  {
    key: 'My Purchases',
    value: 'my-purchases',
    icon: <CartIcon />,
  },
  {
    key: 'Coupons',
    value: 'coupons',
    icon: <GiftIcon />,
  },
  {
    key: 'Reviews',
    value: 'reviews',
    icon: <StarIcon />,
  },
  {
    key: 'Payouts',
    value: 'payouts',
    icon: <CashIcon />,
  },
  {
    key: 'Settings',
    value: 'settings',
    icon: <ParamsIcon />,
  },
];

export const MarketPlaceTabs = () => {
  const { replace } = useRouter();
  const searchParams = useSearchParams();

  const currentTab = searchParams.get('tab');

  const handleChangeTab = (name: string) => {
    const currentTab = tabs.find((tab) => tab.key === name);

    const params = new URLSearchParams();
    params.set('tab', currentTab?.value ?? 'overview');
    replace(`/profile-tabs/marketplace?${params}`);
  };

  useLayoutEffect(() => {
    if (!searchParams.get('tab')) {
      const params = new URLSearchParams();
      params.set('tab', 'overview');
      replace(`/profile-tabs/marketplace?${params}`);
    }
  }, [replace, searchParams]);

  return (
    <div className='flex flex-col gap-10 pt-4'>
      <div className='flex p-1 bg-[#0C101480] backdrop-blur-[100px] border border-[#181B22] rounded-[36px]'>
        <Tabs
          tabs={tabs.map((item) => item.key)}
          onChange={handleChangeTab}
          icons={tabs.map((tab) => tab.icon)}
          defaultIndex={tabs.findIndex(
            (tab) => tab.value === (currentTab ?? 'overview'),
          )}
          className='rounded-[32px] w-[146px] h-[32px] text-[#B0B0B0] text-[15px] bg-[#0C101480] backdrop-blur-[117px]'
        />
      </div>
      <div className='relative right-36'>
        <Breadcrumbs
          items={['Profile', 'Marketplace', 'Seller Dashboard', 'Overview']}
        />
      </div>
      {currentTab === 'overview' && <OverviewTab />}
      {currentTab === 'my-products' && <MyProductsTab />}
      {currentTab === 'sales' && <SalesTab />}
      {currentTab === 'my-purchases' && <MyPurchasesTab />}
      {currentTab === 'coupons' && <div>Контент для Coupons</div>}
      {currentTab === 'reviews' && <ReviewsTab />}
      {currentTab === 'payouts' && <PayoutsTab />}
      {currentTab === 'settings' && <SettingsTab />}
    </div>
  );
};
