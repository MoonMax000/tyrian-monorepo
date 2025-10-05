import { DetailEtfScreen } from '@/screens/DetailEtfScreen';

interface EtfsDetailsParams {
  params: Promise<{ shortName: string }>;
}

export default async function EtfsDetailsPage({ params }: EtfsDetailsParams) {
  const { shortName } = await params;

  return <DetailEtfScreen shortName={shortName} />;
}
