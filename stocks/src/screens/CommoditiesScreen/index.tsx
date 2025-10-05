import CountriesSelect from '@/components/CountriesSelect';
import CommoditiesIndices from './components/CommoditiesIndices';
import CommoditiesTable from './components/CommoditiesTable';

const CommoditiesScreen = () => {
  return (
    <section className='Commodities mt-6'>
      <div className='mb-12'>
        <CountriesSelect />
      </div>
      <CommoditiesIndices />
      <CommoditiesTable />
    </section>
  );
};

export default CommoditiesScreen;
