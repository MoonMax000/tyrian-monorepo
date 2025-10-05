import Courses from '@/components/Courses';
import MainScreen from '@/screens/MainScreen/MainScreen';
import { TabValues } from '@/screens/MainScreen/types';
import { BreadcrumbsJsonLd } from '@/components/BreadcrumbsJsonLd/BreadcrumbsJsonLd';
import { getSiteName } from '@/utils/getSiteName';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Courses & Training Materials in Marketplace of Investment & Trading Strategies',
  description: '❱❱❱ Buy Courses & Training Materials for Investment & Trading Strategies. ⚡ Top Investment Consultants & Traders from Community. ✨ Everything for Informed Stock Trading & Investing',
};

const breadcrumbs = [
  {
    position: 1,
    name: 'Marketplace',
    item: getSiteName()
  },
  {
    position: 2,
    name: '📊 Courses & Training',
    item: getSiteName() + '/courses-tab'
  },
  {
    position: 3,
    name: '📈 Choose the Best!',
    item: getSiteName() + '/courses-tab#buy'
  }
];

export default function CoursesPage() {
  return (
    <>
      <BreadcrumbsJsonLd breadcrumbs={breadcrumbs} />
      <MainScreen tabValue={TabValues.Courses}>
        <Courses />
      </MainScreen>
    </>
  );
}
