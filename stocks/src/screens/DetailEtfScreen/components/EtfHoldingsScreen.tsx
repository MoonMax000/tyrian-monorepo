import ContentWrapper from '@/components/UI/ContentWrapper';
import DetailsCardHeader from '@/components/DetailCardHeader';
import { EtfHoldingsTable } from './EtfHoldingsTable';
import { formatDateMonthYear } from '@/helpers/formatDayMonthYear';
import EtfDetailsImg from '@/assets/etf-details-img.png';

export const EtfHoldingsScreen = ({ shortName }: { shortName: string }) => (
  <section className='mt-12'>
    <ContentWrapper className='pb-4 backdrop-blur-xl'>
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
      <h2 className='mt-4 mx-4 mb-6 text-white font-bold text-[19px]'>
        At {formatDateMonthYear(new Date())}
      </h2>
      <EtfHoldingsTable />
    </ContentWrapper>
  </section>
);
