import CategoryScreen from '@/screens/CategoryScreen';
import { Metadata } from 'next';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: `Категория ${slug}`,
  };
}

const CategoryPage = async ({ params }: Props) => {
  const { slug } = await params;
  return <CategoryScreen slug={slug} />;
};

export default CategoryPage;
