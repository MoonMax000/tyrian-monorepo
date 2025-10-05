import { IndicatorCardScreen } from '@/screens/IndicatorCardScreen';

interface IndicatorCardPageProps {
  params: Promise<{ indicatorName: string }>;
}

export default async function IndicatorCardPage({ params }: IndicatorCardPageProps) {
  const { indicatorName } = await params;

  return <IndicatorCardScreen indicatorName={indicatorName} />;
}
