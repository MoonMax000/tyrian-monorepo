import DividendCalendarScreen from '@/screens/DividendCalendarScreen';
import { Metadata } from 'next';
import { BreadcrumbsJsonLd } from '@/components/BreadcrumbsJsonLd/BreadcrumbsJsonLd';
import { getSiteName } from '@/utils/getSiteName';

export const metadata: Metadata = {
  title: "Dividend Calendar | Tyrian Trade",
  description: "❱❱❱ Dividend Payment Schedule. ⚡ Dividend Amount, Payment Period, Yield & Register Closing Date (cut-off date). ✨ Everything for Informed Stock Trading & Investing"
};

const breadcrumbs = [
  { name: 'Stock Research & Analytics Platform', item: getSiteName() },
  { name: '📆 Dividend Calendar', item: getSiteName() + '/dividends-schedule' },
  { name: '📊 Dividend Yield!', item: getSiteName() + '/dividends-schedule#chart' },
];

export default function Home() {
  return (
    <>
      <BreadcrumbsJsonLd breadcrumbs={breadcrumbs} />
      <DividendCalendarScreen />
    </>
  );
}
