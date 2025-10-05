import { RobotCardsScreen } from '@/screens/RobotsCardScreen';

interface IRobotPageProps {
  params: Promise<{
    robotName: string;
  }>;
}

export default async function RobotCardPage({ params }: IRobotPageProps) {
  const { robotName } = await params;

  return <RobotCardsScreen robotName={robotName} />;
}
