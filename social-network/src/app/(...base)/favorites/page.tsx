import FavoriteScreen from '@/screens/FavoriteScreen';
import { BreadcrumbsJsonLd } from '@/components/BreadcrumbsJsonLd/BreadcrumbsJsonLd';
import { getSiteName } from '@/utilts/getSiteName';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Favorites Posts on Trading & Investing | Tyrian Trade',
  description:
    '❱❱❱ Favorites Social Network Posts. ⚡ Investment & Trading Ideas From the Community. ✨ Everything for Informed Stock Trading & Investing',
};

const siteName = getSiteName();
const breadcrumbsFavorites = [
  { name: 'Social Network', item: siteName },
  { name: '💬 Favorites', item: siteName + '/favorites' },
  { name: '🔥 Read Free!', item: siteName + '/favorites#read' },
];

const Home = () => {
  return <>
    <BreadcrumbsJsonLd breadcrumbs={breadcrumbsFavorites} />
    <FavoriteScreen />
  </>;
};

export default Home;
