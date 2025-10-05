import Favorites from '@/components/Favorites';
import MainScreen from '@/screens/MainScreen/MainScreen';
import { TabValues } from '@/screens/MainScreen/types';

export default function FavoritesPage() {
  return (
    <MainScreen tabValue={TabValues.Favorites}>
      <Favorites />
    </MainScreen>
  );
}
