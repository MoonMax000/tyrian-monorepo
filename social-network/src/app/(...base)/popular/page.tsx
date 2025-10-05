import HomeScreen from '@/screens/HomeScreen';
import { Metadata } from 'next';
import { BreadcrumbsJsonLd } from '@/components/BreadcrumbsJsonLd/BreadcrumbsJsonLd';
import { getSiteName } from '@/utilts/getSiteName';

export const metadata: Metadata = {
  title: 'Popular Posts on Trading & Investing | Tyrian Trade',
  description:
    '❱❱❱ Popular Social Network Posts. ⚡ Investment & Trading Ideas From the Community. ✨ Everything for Informed Stock Trading & Investing',
};

const siteName = getSiteName();
const breadcrumbsPopular = [
  { name: 'Social Network', item: siteName },
  { name: '💬 Popular Posts', item: siteName + '/popular' },
  { name: '🔥 Read Free!', item: siteName + '/popular#read' },
];

const Home = () => {
  return (
    <>
      <BreadcrumbsJsonLd breadcrumbs={breadcrumbsPopular} />
      <HomeScreen />
    </>
  );
};

export default Home;
