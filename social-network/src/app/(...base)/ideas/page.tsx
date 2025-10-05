import IdeasScreen from '@/screens/IdeasScreen';
import { BreadcrumbsJsonLd } from '@/components/BreadcrumbsJsonLd/BreadcrumbsJsonLd';
import { getSiteName } from '@/utilts/getSiteName';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ideas on Trading & Investing | Tyrian Trade',
  description:
    '❱❱❱ Ideas from Social Network. ⚡ Investment & Trading Ideas From the Community. ✨ Everything for Informed Stock Trading & Investing',
};

const siteName = getSiteName();
const breadcrumbsIdeas = [
  { name: 'Social Network', item: siteName },
  { name: '💬 Ideas', item: siteName + '/ideas' },
  { name: '🔥 Read Free!', item: siteName + '/ideas#read' },
];

const Ideas = () => {
  return <>
    <BreadcrumbsJsonLd breadcrumbs={breadcrumbsIdeas} />
    <IdeasScreen />
  </>;
};

export default Ideas;
