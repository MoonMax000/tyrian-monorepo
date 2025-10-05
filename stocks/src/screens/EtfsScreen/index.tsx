import CountriesSelect from '@/components/CountriesSelect';
import EtfsIndices from './components/EtfsIndices';
import EtfsTable from './components/EtfsTable';

const EtfsScreen = () => {
  return (
    <section className='etfs mt-6'>
      <div className='mb-12'>
        <CountriesSelect />
      </div>
      <EtfsIndices />
      <EtfsTable />
    </section>
  );
};

export default EtfsScreen;
