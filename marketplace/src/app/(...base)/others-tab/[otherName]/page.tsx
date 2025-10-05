import { OtherCardScreen } from '@/screens/OtherCardScreen';

interface CourseCardPageProps {
  params: Promise<{ otherName: string }>;
}

export default async function CourseCardPage({ params }: CourseCardPageProps) {
  const { otherName } = await params;
  return <OtherCardScreen otherName={otherName} />;
}
