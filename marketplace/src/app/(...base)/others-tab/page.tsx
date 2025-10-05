import { Metadata } from 'next';
import Others from '@/components/Others';
import MainScreen from '@/screens/MainScreen/MainScreen';
import { TabValues } from '@/screens/MainScreen/types';
import { BreadcrumbsJsonLd } from '@/components/BreadcrumbsJsonLd/BreadcrumbsJsonLd';
import { getSiteName } from '@/utils/getSiteName';

export const metadata: Metadata = {
  title: 'Other Materials in Marketplace of Investment & Trading Strategies',
  description: '❱❱❱ Buy Other Materials for Investment & Trading Strategies. ⚡ Top Investment Consultants & Traders from Community. ✨ Everything for Informed Stock Trading & Investing',
};

const breadcrumbs = [
  {
    position: 1,
    name: 'Marketplace',
    item: getSiteName()
  },
  {
    position: 2,
    name: '📊 Other Materials',
    item: getSiteName() + '/others-tab'
  },
  {
    position: 3,
    name: '📈 Choose the Best!',
    item: getSiteName() + '/others-tab#buy'
  }
];

export default function OthersPage() {
  return (
    <>
      <BreadcrumbsJsonLd breadcrumbs={breadcrumbs} />
      <MainScreen tabValue={TabValues.Others}>
        <Others />
      </MainScreen>
    </>
  );
}
