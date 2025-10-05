import ForUsScreen from '@/screens/ForUsScreen';
import { BreadcrumbsJsonLd } from '@/components/BreadcrumbsJsonLd/BreadcrumbsJsonLd';
import { getSiteName } from '@/utilts/getSiteName';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Recommended Posts on Trading & Investing | Tyrian Trade',
  description:
    '❱❱❱ Recommended Social Network Posts. ⚡ Investment & Trading Ideas From the Community. ✨ Everything for Informed Stock Trading & Investing',
};

const siteName = getSiteName();
const breadcrumbsForUs = [
  { name: 'Social Network', item: siteName },
  { name: '💬 Recommendation', item: siteName + '/for-us' },
  { name: '🔥 Read Free!', item: siteName + '/for-us#read' },
];

const Home = () => {
  return <>
    <BreadcrumbsJsonLd breadcrumbs={breadcrumbsForUs} />
    <ForUsScreen />
  </>;
};

export default Home;
