import { SignalCardScreen } from '@/screens/SignalCardScreen';

interface SignalCardPageProps {
  params: Promise<{ signalName: string }>;
}

export default async function SignalCardPage({ params }: SignalCardPageProps) {
  const { signalName } = await params;

  return <SignalCardScreen signalName={signalName} />;
}
