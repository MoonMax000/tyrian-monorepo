import dynamic from 'next/dynamic';
import { BreadcrumbsJsonLd } from '@/components/BreadcrumbsJsonLd/BreadcrumbsJsonLd';
import { getSiteName } from '@/utils/getSiteName';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Marketplace of Investment & Trading Strategies | Tyrian Trade',
  description: '❱❱❱ Buy Investment & Trading Strategies. ⚡ Top Investment Consultants & Traders from Community. ✨ Everything for Informed Stock Trading & Investing',
};

const DynamicMainScreen = dynamic(() => import('@/screens/MainScreen/MainScreen'), {
  loading: () => <div className='h-[400px]'>Loading...</div>,
  ssr: true,
});

const breadcrumbs = [
  {
    position: 1,
    name: 'Marketplace',
    item: getSiteName()
  },
  {
    position: 2,
    name: '📈 Buy Strategy!',
    item: getSiteName() + '#buy'
  }
];

export default function Home() {
  return (
    <>
      <BreadcrumbsJsonLd breadcrumbs={breadcrumbs} />
      <DynamicMainScreen />
    </>
  );
}