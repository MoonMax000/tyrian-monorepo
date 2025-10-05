import CountriesSelect from '@/components/CountriesSelect';
import BondsIndices from './components/BondsIndices';
import BondsTable from './components/BondsTable';
import { Suspense } from 'react';

const BondsScreen = () => {
  return (
    <section className='bonds mt-6'>
      <div className='mb-12'>
        <CountriesSelect />
      </div>
      <BondsIndices />
      <Suspense>
        <BondsTable />
      </Suspense>
    </section>
  );
};

export default BondsScreen;
