import Consultants from '@/components/Consultants';
import MainScreen from '@/screens/MainScreen/MainScreen';
import { TabValues } from '@/screens/MainScreen/types';
import { BreadcrumbsJsonLd } from '@/components/BreadcrumbsJsonLd/BreadcrumbsJsonLd';
import { getSiteName } from '@/utils/getSiteName';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Consultations in Marketplace of Investment & Trading Strategies',
  description: '❱❱❱ Buy Consultations for Investment & Trading Strategies. ⚡ Top Investment Consultants & Traders from Community. ✨ Everything for Informed Stock Trading & Investing',
};

const breadcrumbs = [
  {
    position: 1,
    name: 'Marketplace',
    item: getSiteName()
  },
  {
    position: 2,
    name: '📊 Consultants',
    item: getSiteName() + '/consultants-tab'
  },
  {
    position: 3,
    name: '📈 Choose the Best!',
    item: getSiteName() + '/consultants-tab#buy'
  }
];

export default function ConsultantsPage() {
  return (
    <>
      <BreadcrumbsJsonLd breadcrumbs={breadcrumbs} />
      <MainScreen tabValue={TabValues.Consultants}>
        <Consultants />
      </MainScreen>
    </>
  );
}
