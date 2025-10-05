import { CourseCardScreen } from '@/screens/CourseCardScreen';

interface CourseCardPageProps {
  params: Promise<{ courseName: string }>;
}

export default async function CourseCardPage({ params }: CourseCardPageProps) {
  const { courseName } = await params;
  return <CourseCardScreen courseName={courseName} />;
}
