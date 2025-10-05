import { EtfAnalysisScreen } from '@/screens/DetailEtfScreen';

interface EtfAnalysisParams {
  params: Promise<{ shortName: string }>;
}

export default async function EtfAnalysisPage({ params }: EtfAnalysisParams) {
  const { shortName } = await params;
  return <EtfAnalysisScreen shortName={shortName} />;
}
