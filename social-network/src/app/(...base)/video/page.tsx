import VideosScreen from '@/screens/VideosScreen';
import { BreadcrumbsJsonLd } from '@/components/BreadcrumbsJsonLd/BreadcrumbsJsonLd';
import { getSiteName } from '@/utilts/getSiteName';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Posts with Video on Trading & Investing | Tyrian Trade',
  description:
    '❱❱❱ Social Network Posts with Video. ⚡ Investment & Trading Ideas From the Community. ✨ Everything for Informed Stock Trading & Investing',
};

const siteName = getSiteName();
const breadcrumbsVideo = [
  { name: 'Social Network', item: siteName },
  { name: '💬 Posts with Video', item: siteName + '/video' },
  { name: '🔥 Watch Free!', item: siteName + '/video#read' },
];

const Video = () => {
  return <>
    <BreadcrumbsJsonLd breadcrumbs={breadcrumbsVideo} />
    <VideosScreen />
  </>;
};

export default Video;
