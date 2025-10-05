import { AnalystCardScreen } from '@/screens/AnalystCardScreen';

type AnalysistCardPageProps = {
  params: Promise<{ analystName: string }>;
};

export default async function AnalysistCardPage({ params }: AnalysistCardPageProps) {
  const { analystName } = await params;
  return <AnalystCardScreen analystName={analystName} />;
}
