import AttributeCard from '@/components/UI/AttributeCard';
import { EtfCardInfo } from './EtfCardInfo';
import { StockList } from './StocksList';
import { LocationList } from './LocationList';
import {
  mockStocksList,
  mockLocationList,
  aboutAttributes,
  classificationAttributes,
  keyStatsAttributes,
} from '../constants';

export const EtfAnalysisScreen = ({ shortName }: { shortName: string }) => (
  <section className='mt-12'>
    <EtfCardInfo shortName={shortName} />
    <AttributeCard items={keyStatsAttributes} title='Key Stats' className='mt-6 p-4' />
    <AttributeCard
      items={aboutAttributes}
      title='About VANGUARD FUNDS PLC S&P 500 UCITS ETF USD DIS'
      bottomContent={
        <p className='text-grayLight text-[15px] font-medium max-w-[720px]'>
          This Fund seeks to track the performance of the Index, a widely recognised benchmark of
          U.S. stock market performance that is comprised of the stocks of large U.S. companies.
        </p>
      }
      className='mt-6 p-4'
    />
    <AttributeCard items={classificationAttributes} title='Classification' className='mt-6 p-4' />
    <StockList stocks={mockStocksList} analysisDate={new Date().toDateString()} className='mt-6' />
    <LocationList
      locations={mockLocationList}
      analysisDate={new Date().toDateString()}
      className='mt-6'
    />
  </section>
);
