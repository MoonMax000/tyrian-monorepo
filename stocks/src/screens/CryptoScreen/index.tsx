import { Suspense } from 'react';
import CryptoIndices from './components/CryptoIndices';
import CryptoTable from './components/CryptoTable';

const CryptoScreen = () => {
  return (
    <section className='crypto mt-[108px]'>
      <CryptoIndices />
      <Suspense>
        <CryptoTable />
      </Suspense>
    </section>
  );
};

export default CryptoScreen;
