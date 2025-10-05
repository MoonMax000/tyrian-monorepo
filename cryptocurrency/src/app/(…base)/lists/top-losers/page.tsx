import TopLosersScreen from '@/screens/ListsScreens/TopLosersScreen';
import { Metadata } from 'next';


export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Volume Leaders`,
  };
}

const CategoryPage = async () => {
  return <TopLosersScreen />;
};

export default CategoryPage;
