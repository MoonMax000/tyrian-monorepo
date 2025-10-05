import { Metadata } from 'next';

import MainScreen from '@/screens/MainScreen/MainScreen';
import { TabValues } from '@/screens/MainScreen/types';
import { BreadcrumbsJsonLd } from '@/components/BreadcrumbsJsonLd/BreadcrumbsJsonLd';
import { getSiteName } from '@/utils/getSiteName';
import Analystys from '@/components/Analystys';

export const metadata: Metadata = {
  title: 'Analystys Materials in Marketplace of Investment & Trading Strategies',
  description:
    '❱❱❱ Buy Analystys Materials for Investment & Trading Strategies. ⚡ Top Investment Consultants & Traders from Community. ✨ Everything for Informed Stock Trading & Investing',
};

const breadcrumbs = [
  {
    position: 1,
    name: 'Marketplace',
    item: getSiteName(),
  },
  {
    position: 2,
    name: '📊 Analystys Materials',
    item: getSiteName() + '/analystys-tab',
  },
  {
    position: 3,
    name: '📈 Choose the Best!',
    item: getSiteName() + '/analystys-tab#buy',
  },
];

export default function AnalystysPage() {
  return (
    <>
      <BreadcrumbsJsonLd breadcrumbs={breadcrumbs} />
      <MainScreen tabValue={TabValues.Analystys}>
        <Analystys />
      </MainScreen>
    </>
  );
}
