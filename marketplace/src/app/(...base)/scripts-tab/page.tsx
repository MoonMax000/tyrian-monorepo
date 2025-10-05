import { Metadata } from 'next';
import MainScreen from '@/screens/MainScreen/MainScreen';
import { TabValues } from '@/screens/MainScreen/types';
import ScriptScreen from '@/screens/ScriptScreen';
import { BreadcrumbsJsonLd } from '@/components/BreadcrumbsJsonLd/BreadcrumbsJsonLd';
import { getSiteName } from '@/utils/getSiteName';

export const metadata: Metadata = {
  title: 'Scripts & Software in Marketplace of Investment & Trading Strategies',
  description: '❱❱❱ Buy Scripts & Software for Investment & Trading Strategies. ⚡ Top Investment Consultants & Traders from Community. ✨ Everything for Informed Stock Trading & Investing',
};

const breadcrumbs = [
  {
    position: 1,
    name: 'Marketplace',
    item: getSiteName()
  },
  {
    position: 2,
    name: '📊 Scripts',
    item: getSiteName() + '/scripts-tab'
  },
  {
    position: 3,
    name: '📈 Choose the Best!',
    item: getSiteName() + '/scripts-tab#buy'
  }
];

export default function ScriptsPage() {
  return (
    <>
      <BreadcrumbsJsonLd breadcrumbs={breadcrumbs} />
      <MainScreen tabValue={TabValues.Script}>
        <ScriptScreen />
      </MainScreen>
    </>
  );
}
