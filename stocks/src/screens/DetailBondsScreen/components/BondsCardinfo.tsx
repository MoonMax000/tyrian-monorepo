import ContentWrapper from '@/components/UI/ContentWrapper';
import DetailsCardHeader from '@/components/DetailCardHeader';
import { CommoditiesDiagram } from '../../DetailCommoditiesScreen/components/CommoditiesDiagram';
import { FC } from 'react';

interface Props {
  shortName: string;
  title?: string;
}

export const BondsCardInfo: FC<Props> = ({ shortName, title }) => {
  return (
    <ContentWrapper>
      <DetailsCardHeader
        img='/countries/usa.svg'
        name={title ?? ''}
        shortName={shortName}
        pathTo='CBOTCBOT'
        currentPrice={995.495}
        priceChange={-12.78}
        percentChange={-7.64}
        afterPrice='USDT'
        className='px-6 pt-6 pb-4 border-b-2 border-regaliaPurple'
      />
      <div className='mt-6'>
        <CommoditiesDiagram />
      </div>
    </ContentWrapper>
  );
};
