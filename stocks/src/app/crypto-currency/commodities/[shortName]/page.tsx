import { DetailCommoditiesScreen } from '@/screens/DetailCommoditiesScreen';

interface EtfsDetailsParams {
  params: Promise<{ shortName: string }>;
}

export default async function EtfsDetailsPage({ params }: EtfsDetailsParams) {
  const { shortName } = await params;

  return <DetailCommoditiesScreen shortName={shortName} />;
}
