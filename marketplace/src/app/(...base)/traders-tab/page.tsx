import { Metadata } from 'next';

import MainScreen from '@/screens/MainScreen/MainScreen';
import { TabValues } from '@/screens/MainScreen/types';
import { BreadcrumbsJsonLd } from '@/components/BreadcrumbsJsonLd/BreadcrumbsJsonLd';
import { getSiteName } from '@/utils/getSiteName';
import Traders from '@/components/Traders';

export const metadata: Metadata = {
  title: 'Traders Materials in Marketplace of Investment & Trading Strategies',
  description:
    '❱❱❱ Buy Traders Materials for Investment & Trading Strategies. ⚡ Top Investment Consultants & Traders from Community. ✨ Everything for Informed Stock Trading & Investing',
};

const breadcrumbs = [
  {
    position: 1,
    name: 'Marketplace',
    item: getSiteName(),
  },
  {
    position: 2,
    name: '📊 Traders Materials',
    item: getSiteName() + '/traders-tab',
  },
  {
    position: 3,
    name: '📈 Choose the Best!',
    item: getSiteName() + '/traders-tab#buy',
  },
];

export default function TradersPage() {
  return (
    <>
      <BreadcrumbsJsonLd breadcrumbs={breadcrumbs} />
      <MainScreen tabValue={TabValues.Traders}>
        <Traders />
      </MainScreen>
    </>
  );
}
