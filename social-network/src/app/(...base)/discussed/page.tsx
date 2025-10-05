import DiscussedScreen from '@/screens/DiscussedScreen';
import { BreadcrumbsJsonLd } from '@/components/BreadcrumbsJsonLd/BreadcrumbsJsonLd';
import { getSiteName } from '@/utilts/getSiteName';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hot Topics on Trading & Investing | Tyrian Trade',
  description:
    '❱❱❱ Social Network Hot Topics. ⚡ Investment & Trading Ideas From the Community. ✨ Everything for Informed Stock Trading & Investing',
};

const siteName = getSiteName();
const breadcrumbsDiscussed = [
  { name: 'Social Network', item: siteName },
  { name: '💬 Hot Topics', item: siteName + '/discussed' },
  { name: '🔥 Read Topics!', item: siteName + '/discussed#read' },
];

const Discussed = () => {
  return <>
    <BreadcrumbsJsonLd breadcrumbs={breadcrumbsDiscussed} />
    <DiscussedScreen />
  </>;
};

export default Discussed;
