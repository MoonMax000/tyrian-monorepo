import Leader from '@/screens/Leader';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Лидеры роста',
};

const Volume = () => {
  return <Leader type='growth' />;
};

export default Volume;
