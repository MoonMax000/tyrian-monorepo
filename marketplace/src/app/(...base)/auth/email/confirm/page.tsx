import ConfirmEmailScreen from '@/screens/ConfirmEmailScreen';
import { Suspense } from 'react';

const Home = () => {
  return (
    <Suspense>
      <ConfirmEmailScreen />
    </Suspense>
  );
};

export default Home;
