import ChatsScreen from "@/screens/ChatsScreen";
import { BreadcrumbsJsonLd } from '@/components/BreadcrumbsJsonLd/BreadcrumbsJsonLd';
import { getSiteName } from '@/utilts/getSiteName';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chats | Tyrian Trade',
  description:
    '❱❱❱ Active Chats in Social Network. ⚡ Investment & Trading Ideas From the Community. ✨ Everything for Informed Stock Trading & Investing',
};

const siteName = getSiteName();
const breadcrumbsChats = [
  { name: 'Social Network', item: siteName },
  { name: '💬 Active Chats', item: siteName + '/chats' },
];

const Home = () => {
  return (
    <>
      <BreadcrumbsJsonLd breadcrumbs={breadcrumbsChats} />
      <ChatsScreen />
    </>
  );
};

export default Home;
