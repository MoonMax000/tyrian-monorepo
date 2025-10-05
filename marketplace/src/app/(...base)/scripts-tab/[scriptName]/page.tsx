import { ScriptCardScreen } from '@/screens/ScriptCardScreen';

interface ScriptCardPageProps {
  params: Promise<{ scriptName: string }>;
}

export default async function ScriptCardPage({ params }: ScriptCardPageProps) {
  const { scriptName } = await params;
  return <ScriptCardScreen scriptName={scriptName} />;
}
