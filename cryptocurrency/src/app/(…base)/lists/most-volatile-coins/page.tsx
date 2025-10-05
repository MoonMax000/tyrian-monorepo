import MostVolatileCoins from '@/screens/ListsScreens/MostVolatileCoinsScreen';
import { Metadata } from 'next';


export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Volume Leaders`,
  };
}

const CategoryPage = async () => {
  return <MostVolatileCoins />;
};

export default CategoryPage;
