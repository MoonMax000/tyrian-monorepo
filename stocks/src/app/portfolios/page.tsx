import PortfoliosMockScreen from '@/screens/PortfoliosMockScreen';
import { Metadata } from 'next';
import { BreadcrumbsJsonLd } from '@/components/BreadcrumbsJsonLd/BreadcrumbsJsonLd';
import { getSiteName } from '@/utils/getSiteName';

export const metadata: Metadata = {
  title: "Investing Portfolios | Tyrian Trade",
  description: "❱❱❱ View Investment Portfolios. ⚡ Portfolio Value & Profit. ✨ Everything for Informed Stock Trading & Investing"
};

const breadcrumbs = [
  { name: 'Stock Research & Analytics Platform', item: getSiteName() },
  { name: '💼 Portfolios', item: getSiteName() + '/portfolios' },
  { name: '📊 Increase Income!', item: getSiteName() + '/portfolios#view' },
];

const Portfolios = () => {
  return (
    <>
      <BreadcrumbsJsonLd breadcrumbs={breadcrumbs} />
      <PortfoliosMockScreen />
    </>
  );
};

export default Portfolios;
