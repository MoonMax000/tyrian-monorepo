import ResearchReportsScreen from '@/screens/ ResearchReportsScreen';
import { Metadata } from 'next';
import { BreadcrumbsJsonLd } from '@/components/BreadcrumbsJsonLd/BreadcrumbsJsonLd';
import { getSiteName } from '@/utils/getSiteName';

export const metadata: Metadata = {
  title: "Research Reports | Tyrian Trade",
  description: "❱❱❱ View Research Reports. ⚡ Invest Wisely With Our Community. ✨ Everything for Informed Stock Trading & Investing"
};

const breadcrumbs = [
  { name: 'Stock Research & Analytics Platform', item: getSiteName() },
  { name: '🔬 Research Reports', item: getSiteName() + '/research' },
  { name: '📊 Invest Wisely!', item: getSiteName() + '/research#view' },
];

export default function Home() {
  return (
    <>
      <BreadcrumbsJsonLd breadcrumbs={breadcrumbs} />
      <ResearchReportsScreen />
    </>
  );
}
