import Strategies from '@/components/Strategies';
import MainScreen from '@/screens/MainScreen/MainScreen';
import { TabValues } from '@/screens/MainScreen/types';
import { BreadcrumbsJsonLd } from '@/components/BreadcrumbsJsonLd/BreadcrumbsJsonLd';
import { getSiteName } from '@/utils/getSiteName';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Strategies & Portfolios in Marketplace of Investment & Trading Strategies',
  description: '❱❱❱ Buy Strategies & Portfolios for Investment & Trading Strategies. ⚡ Top Investment Consultants & Traders from Community. ✨ Everything for Informed Stock Trading & Investing',
};

const breadcrumbs = [
  {
    position: 1,
    name: 'Marketplace',
    item: getSiteName()
  },
  {
    position: 2,
    name: '📊 Strategies',
    item: getSiteName() + '/strategies-tab'
  },
  {
    position: 3,
    name: '📈 Choose the Best!',
    item: getSiteName() + '/strategies-tab#buy'
  }
];

export default function StrategiesPage() {
  return (
    <>
      <BreadcrumbsJsonLd breadcrumbs={breadcrumbs} />
      <MainScreen tabValue={TabValues.Strategies}>
        <Strategies />
      </MainScreen>
    </>
  );
}
