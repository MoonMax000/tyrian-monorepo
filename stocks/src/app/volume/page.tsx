import Leader from '@/screens/Leader';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Leader by Volume',
};

const Volume = () => {
  return <Leader type='volume' />;
};

export default Volume;
