import NewScreen from '@/screens/NewScreen';
import { BreadcrumbsJsonLd } from '@/components/BreadcrumbsJsonLd/BreadcrumbsJsonLd';
import { getSiteName } from '@/utilts/getSiteName';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'New Posts on Trading & Investing | Tyrian Trade',
  description:
    '❱❱❱ Latest Social Network Posts. ⚡ Investment & Trading Ideas From the Community. ✨ Everything for Informed Stock Trading & Investing',
};

const siteName = getSiteName();
const breadcrumbsNew = [
  { name: 'Social Network', item: siteName },
  { name: '💬 New Posts', item: siteName + '/new' },
  { name: '🔥 Read Free!', item: siteName + '/new#read' },
];

const Home = () => {
  return <>
    <BreadcrumbsJsonLd breadcrumbs={breadcrumbsNew} />
    <NewScreen />
  </>;
};

export default Home;
