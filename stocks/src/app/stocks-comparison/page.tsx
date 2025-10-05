import StocksComparision from '@/screens/StockComparison';
import { Metadata } from 'next';
import { BreadcrumbsJsonLd } from '@/components/BreadcrumbsJsonLd/BreadcrumbsJsonLd';
import { getSiteName } from '@/utils/getSiteName';

export const metadata: Metadata = {
  title: "Stock Comparison | Tyrian Trade",
  description: "❱❱❱ Add Stock to Compare. ⚡ Just Enter a Ticker or Company Name. ⭐ Market Value, Capitalization & much more. ✨ Everything for Informed Stock Trading & Investing"
};

const breadcrumbs = [
  { name: 'Stock Research & Analytics Platform', item: getSiteName() },
  { name: '📊 Stock Comparison', item: getSiteName() + '/stocks-comparison' },
  { name: '📈 Start Comparing!', item: getSiteName() + '/stocks-comparison#chart' },
];

const StocksComparisonPage = () => {
  return (
    <>
      <BreadcrumbsJsonLd breadcrumbs={breadcrumbs} />
      <StocksComparision />
    </>
  );
};

export default StocksComparisonPage;
