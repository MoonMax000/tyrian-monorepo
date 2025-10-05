import Recomendations from '@/components/Recomendations';
import MainScreen from '@/screens/MainScreen/MainScreen';
import { TabValues } from '@/screens/MainScreen/types';
import { BreadcrumbsJsonLd } from '@/components/BreadcrumbsJsonLd/BreadcrumbsJsonLd';
import { getSiteName } from '@/utils/getSiteName';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Popular in Marketplace of Investment & Trading Strategies',
  description:
    '❱❱❱ Buy Popular for Investment & Trading Strategies. ⚡ Top Investment Consultants & Traders from Community. ✨ Everything for Informed Stock Trading & Investing',
};

const breadcrumbs = [
  {
    position: 1,
    name: 'Marketplace',
    item: getSiteName(),
  },
  {
    position: 2,
    name: '📊 popular',
    item: getSiteName() + '/popular-tab',
  },
  {
    position: 3,
    name: '📈 Choose the Best!',
    item: getSiteName() + '/popular-tab#buy',
  },
];

export default function RecommendationsPage() {
  return (
    <>
      <BreadcrumbsJsonLd breadcrumbs={breadcrumbs} />
      <MainScreen tabValue={TabValues.Popular}>
        <Recomendations />
      </MainScreen>
    </>
  );
}
