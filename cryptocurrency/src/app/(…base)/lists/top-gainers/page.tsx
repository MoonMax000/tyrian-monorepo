import TopGainersScreen from '@/screens/ListsScreens/TopGainersScreen';
import { Metadata } from 'next';


export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Volume Leaders`,
  };
}

const CategoryPage = async () => {
  return <TopGainersScreen />;
};

export default CategoryPage;
