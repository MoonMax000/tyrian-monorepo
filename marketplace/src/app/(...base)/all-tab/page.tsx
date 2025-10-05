import All from '@/components/All';
import MainScreen from '@/screens/MainScreen/MainScreen';
import { TabValues } from '@/screens/MainScreen/types';
import { BreadcrumbsJsonLd } from '@/components/BreadcrumbsJsonLd/BreadcrumbsJsonLd';
import { getSiteName } from '@/utils/getSiteName';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Products in Marketplace of Investment & Trading Strategies',
  description: '❱❱❱ Buy All Products for Investment & Trading Strategies. ⚡ Top Investment Consultants & Traders from Community. ✨ Everything for Informed Stock Trading & Investing',
};

const breadcrumbs = [
  {
    position: 1,
    name: 'Marketplace',
    item: getSiteName()
  },
  {
    position: 2,
    name: '📊 All',
    item: getSiteName() + '/all-tab'
  },
  {
    position: 3,
    name: '📈 Choose the Best!',
    item: getSiteName() + '/all-tab#buy'
  }
];

export default function AllPage() {
  return (
    <>
      <BreadcrumbsJsonLd breadcrumbs={breadcrumbs} />
      <MainScreen tabValue={TabValues.All}>
        <All />
      </MainScreen>
    </>
  );
}
