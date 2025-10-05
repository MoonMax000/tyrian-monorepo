import ContentWrapper from '@/components/UI/ContentWrapper';
import DetailsCardHeader from '@/components/DetailCardHeader';
import EtfDetailsImg from '@/assets/etf-details-img.png';
import EtfDiargam from './EtfDiagram';

export const EtfCardInfo = ({ shortName }: { shortName: string }) => {
  return (
    <ContentWrapper>
      <DetailsCardHeader
        img={EtfDetailsImg.src}
        name='VANGUARD FUNDS PLC S&P 500 UCITS ETF USD DIS'
        shortName={shortName}
        pathTo='Euronext'
        currentPrice={995.495}
        priceChange={-12.78}
        percentChange={-7.64}
        afterPrice='EUR'
        className='px-6 pt-6 pb-4 border-b-2 border-regaliaPurple'
      />
      <div className='mt-6'>
        <EtfDiargam />
      </div>
    </ContentWrapper>
  );
};
