import ScriptsScreen from '@/screens/ScriptsScreen';
import { BreadcrumbsJsonLd } from '@/components/BreadcrumbsJsonLd/BreadcrumbsJsonLd';
import { getSiteName } from '@/utilts/getSiteName';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Scripts on Trading & Investing | Tyrian Trade',
  description:
    '❱❱❱ Scripts from Social Network. ⚡ Investment & Trading Ideas From the Community. ✨ Everything for Informed Stock Trading & Investing',
};

const siteName = getSiteName();
const breadcrumbsScripts = [
  { name: 'Social Network', item: siteName },
  { name: '💬 Scripts', item: siteName + '/scripts' },
  { name: '🔥 Read Free!', item: siteName + '/scripts#read' },
];

const Scripts = () => {
  return <>
    <BreadcrumbsJsonLd breadcrumbs={breadcrumbsScripts} />
    <ScriptsScreen />
  </>;
};

export default Scripts;
