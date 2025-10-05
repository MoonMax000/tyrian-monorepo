import VolumeLeadersScreen from '@/screens/ListsScreens/VolumeLeadersScreen';
import { Metadata } from 'next';


export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Volume Leaders`,
  };
}

const CategoryPage = async () => {
  return <VolumeLeadersScreen />;
};

export default CategoryPage;
