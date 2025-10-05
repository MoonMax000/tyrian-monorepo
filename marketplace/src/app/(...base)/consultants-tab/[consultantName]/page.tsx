import { ConsultantCardScreen } from '@/screens/ConsultantCardScreen';

interface ConsultantCardPageProps {
  params: Promise<{ consultantName: string }>;
}

export default async function ConsultantCardPage({ params }: ConsultantCardPageProps) {
  const { consultantName } = await params;
  return <ConsultantCardScreen consultantName={consultantName} />;
}
