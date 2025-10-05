import EventsCalendarScreen from '@/screens/EventsCalendarScreen';
import { Metadata } from 'next';
import { BreadcrumbsJsonLd } from '@/components/BreadcrumbsJsonLd/BreadcrumbsJsonLd';
import { getSiteName } from '@/utils/getSiteName';

export const metadata: Metadata = {
  title: "Events Calendar for Stock Trading & Investing | Tyrian Trade",
  description: "❱❱❱ Events Calendar for Stock Trading & Investing. ⚡ Financial & Operating Results, Dividends, Board of Directors, Shareholder Meeting. ✨ Everything for Informed Stock Trading & Investing"
};

const breadcrumbs = [
  { name: 'Stock Research & Analytics Platform', item: getSiteName() },
  { name: '📆 Events Calendar', item: getSiteName() + '/events-calendar' },
  { name: '📊 Follow the Events!', item: getSiteName() + '/events-calendar#chart' },
];

export default function Home() {
  return (
    <>
      <BreadcrumbsJsonLd breadcrumbs={breadcrumbs} />
      <EventsCalendarScreen />
    </>
  );
}
