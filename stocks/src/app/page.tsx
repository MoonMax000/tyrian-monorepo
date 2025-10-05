import { MainContent } from '@/screens/MainContent/MainContent';
import { Metadata } from 'next';
import { BreadcrumbsJsonLd } from '@/components/BreadcrumbsJsonLd/BreadcrumbsJsonLd';
import { getSiteName } from '@/utils/getSiteName';

export const metadata: Metadata = {
  title: "Stock Market Research & Analytics Platform | Tyrian Trade",
  description: "❱❱❱ Real-time Stock Prices & Quote History. ⚡ Latest News & Insights. ⭐ Dividend Timeline and Yield. ✨ Everything for Informed Stock Trading & Investing"
};

const breadcrumbs = [
  { name: 'Stock Research & Analytics Platform', item: getSiteName() },
  { name: '📊 Real-time Data!', item: getSiteName() + '/#chart' },
];

export default function Home() {
  return (
    <>
      <BreadcrumbsJsonLd breadcrumbs={breadcrumbs} />
      <MainContent />
    </>
  );
}
