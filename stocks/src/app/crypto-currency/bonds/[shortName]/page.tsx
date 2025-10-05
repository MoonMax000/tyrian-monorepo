import { DetailBondsScreen } from '@/screens/DetailBondsScreen';
import { DetailCommoditiesScreen } from '@/screens/DetailCommoditiesScreen';

interface EtfsDetailsParams {
  params: Promise<{ shortName: string }>;
}

export default async function EtfsDetailsPage({ params }: EtfsDetailsParams) {
  const { shortName } = await params;

  return <DetailBondsScreen shortName={shortName} />;
}
