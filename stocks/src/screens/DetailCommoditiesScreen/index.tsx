import AttributeCard from '@/components/UI/AttributeCard';
import { CommoditiesCardInfo } from './components';
import { contractHighlightsAttributes } from './contants';

export const DetailCommoditiesScreen = ({ shortName }: { shortName: string }) => (
  <section className='mt-12'>
    <CommoditiesCardInfo shortName={shortName} />
    <AttributeCard
      items={contractHighlightsAttributes}
      title='Contract Highlights'
      className='mt-6 p-4'
    />
  </section>
);
