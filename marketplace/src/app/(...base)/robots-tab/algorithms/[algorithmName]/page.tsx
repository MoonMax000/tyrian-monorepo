import AlgorithmCardsScreen from '@/screens/AlgorithmCardsScreen';

type AlgorithmPageProps = {
  params: Promise<{
    algorithmName: string;
  }>;
};

export default async function Page({ params }: AlgorithmPageProps) {
  const { algorithmName } = await params;

  return <AlgorithmCardsScreen algorithmName={algorithmName} />;
}
