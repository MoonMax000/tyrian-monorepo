import { BreadcrumbsJsonLd } from '@/components/BreadcrumbsJsonLd/BreadcrumbsJsonLd';
import NewsScreen from '@/screens/NewsScreen';
import { getSiteName } from '@/utils/getSiteName';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Market News Feed | Tyrian Trade",
  description: "❱❱❱ Latest Market News. ⚡ Quick Filtering by Countries & Exchanges. ✨ Everything for Informed Stock Trading & Investing"
};

const breadcrumbs = [
  { name: 'Stock Research & Analytics Platform', item: getSiteName() },
  { name: '📰 News Feed', item: getSiteName() + '/market-news' },
  { name: '📊 Follow the Trends!', item: getSiteName() + '/market-news#feed' },
];

export default function MarketNewsPage() {
  return (
    <>
      <BreadcrumbsJsonLd breadcrumbs={breadcrumbs} />
      <NewsScreen />
    </>
  );
}
