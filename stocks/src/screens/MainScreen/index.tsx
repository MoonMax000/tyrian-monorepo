'use client';
import Container from '@/components/UI/Container';
import StatisticsBlock from './components/StatisticsBlock';
import AllFunctionsAdvertisement from './components/AllFunctionsAdvertisement';
import Button from '@/components/UI/Button';
import NewsBlock from './components/NewsBlock';
import StockLeaders from './components/StockLeaders';
import { mockCountryStatisticsData, MockETF, mockStocksProfability } from './constants';
import EconomicSlider from './components/EconomicSlider';
import Link from 'next/link';
import MainIndexes from './components/MainIndexes';
import ReportingCalendarSlider from './components/ReportingCalendarSlider';
import BondsCompanies from './components/BondsCompanies';
import CountryStatictics from './components/CountryStatictics';
import CountriesSelect from '@/components/CountriesSelect';
import MainEconomicIndicators from './components/MainEconomicIndicators';
import BondsYields from './components/BondsYields';
import { useQuery } from '@tanstack/react-query';
import { MainPageService } from '@/services/MainPageService';
import Skeleton from '@/components/UI/Skeleton';
import Image from 'next/image';
import IndexesSlider from './components/MainIndexes/IndexesSlider';
import CurrencyStocksBlock from '../HomeScreen/components/CurrencyStocksBlock';

const MainScreen = () => {
  const { data: marketLeadersGrowthData } = useQuery({
    queryKey: ['getMarketLeadersGrowth'],
    queryFn: () => MainPageService.marketLeadersGrowth('us', 6),
  });

  const { data: marketLeadersVolumeData } = useQuery({
    queryKey: ['getMarketLeadersVolume'],
    queryFn: () => MainPageService.marketLeadersVolume('us', 6),
  });

  const { data: marketLeadersVolatileData } = useQuery({
    queryKey: ['getMarketLeadersVolatile'],
    queryFn: () => MainPageService.marketLeadersVolatile('us', 6),
  });

  const { data: marketLeadersLosersData } = useQuery({
    queryKey: ['getMarketLeadersLosers'],
    queryFn: () => MainPageService.marketLeadersLosers('us', 6),
  });

  return (
    <>
      <Container>
        <h1 className='text-h1 leading-[54px] text-center font-bold mx-auto mt-[120px]'>
          Stock Research & Analytics Platform
        </h1>

        <p className='text-body-15 text-center mx-auto max-w-[55%] opacity-[48%] mt-4 mb-[80px] !font-bold'>
          We monitor the markets daily so you don’t have to - freeing you to focus on what tryly
          matters: family, passions, and life. Your money keeps working while you live.
        </p>

        <CountriesSelect />

        <section className='py-[80px] border-b border-onyxGrey'>
          <div className='flex items-center gap-3 mb-8'>
            <h2 className='text-[39px] font-bold'>Major Indices</h2>
            {/* <Link
              href='/indexes'
              className='text-body-15 text-purple mt-5 flex items-center gap-[10px]'
            >
              All Indices
              <Image src='/arrow-circuled.svg' alt='arrow' width={5.52} height={7.06} />
            </Link> */}
          </div>

          <MainIndexes />
        </section>

        <section className='mt-[48px]'>
          <h2 className='text-[39px] font-bold'>USA Stocks</h2>

          <section className='mt-8 mb-6 rounded-xl bg-blackedGray'>
            <CurrencyStocksBlock />
          </section>

          <div className='grid grid-cols-2 gap-6'>
            {marketLeadersVolumeData ? (
              <StockLeaders
                title='Volume Leaders'
                link='/volume'
                stocks={marketLeadersVolumeData.slice(0, 6)}
              />
            ) : (
              <Skeleton className=' min-w-[613px] min-h-[506px]' />
            )}
            {marketLeadersVolatileData ? (
              <StockLeaders
                title='Most Volatile Stocks'
                link='/volatility'
                stocks={marketLeadersVolatileData.slice(0, 6)}
              />
            ) : (
              <Skeleton className=' min-w-[613px] min-h-[506px]' />
            )}
            {marketLeadersGrowthData ? (
              <StockLeaders
                title='Top Gainers'
                link='/height'
                stocks={marketLeadersGrowthData.slice(0, 6)}
              />
            ) : (
              <Skeleton className=' min-w-[613px] min-h-[506px]' />
            )}
            {marketLeadersLosersData ? (
              <StockLeaders
                title='Top Losers'
                link='/fall'
                stocks={marketLeadersLosersData.slice(0, 6)}
              />
            ) : (
              <Skeleton className=' min-w-[613px] min-h-[506px]' />
            )}
          </div>
        </section>

        <section className='pb-[80px] mt-6 border-b border-onyxGrey'>
          <ReportingCalendarSlider />
        </section>

        <section className='pt-[80px] pb-[130px] flex flex-col gap-6 border-b border-onyxGrey'>
          <div className='flex items-center gap-3 mb-2'>
            <h2 className='text-[39px] font-bold'>USA Government Bond Yields</h2>
            {/* <Link
              href='/bonds'
              className='text-body-15 underline-offset-2 text-purple flex items-center gap-[10px] mt-5'
            >
              All bonds
              <Image src='/arrow-circuled.svg' alt='arrow' width={5.52} height={7.06} />
            </Link> */}
          </div>

          <BondsYields />

          <BondsCompanies />

          <div className='grid grid-cols-2 gap-6'>
            <StockLeaders title='ETF' link='table/etf' stocks={MockETF} />
            <StockLeaders
              title='Futures & Commodities'
              link='table/fut&com'
              stocks={mockStocksProfability}
            />
          </div>
        </section>

        <section className='pt-[80px]'>
          <h2 className='text-[39px] font-bold ml-6 mb-8'>Economic of the USA</h2>

          <MainEconomicIndicators />

          <div className='grid grid-cols-2 gap-6 my-[80px]'>
            <CountryStatictics
              heading='GDP'
              link='table/gdp'
              linkName='All GDP Indicators'
              data={mockCountryStatisticsData.vvp}
            />
            <CountryStatictics
              heading='State-Owned Enterprises'
              link='table/country-companies'
              linkName='View All'
              data={mockCountryStatisticsData.countryCompanies}
            />
            <CountryStatictics
              heading='Prices'
              link='table/prices'
              linkName='All Price Indicatrors'
              data={mockCountryStatisticsData.prices}
            />
            <CountryStatictics
              heading='Employment'
              link='table/employment-of-population'
              linkName='All Labor Market Indicators'
              data={mockCountryStatisticsData.employmentOfPopulation}
            />
          </div>

          <EconomicSlider />
        </section>
      </Container>

      <div className='mt-[80px] pt-[80px] pb-[120px] border-t border-onyxGrey'>
        <Container>
          <section>
            <StatisticsBlock />
          </section>

          <section className='mt-[60px]'>
            <NewsBlock />
          </section>

          <section className='mt-[48px] mb-[64px]'>
            <h2 className='text-h2 leading-[54px] text-center font-bold'>
              Unlock Full Service Benefits
            </h2>

            <p className='text-body-15 text-center opacity-[48%] mt-4 mb-[48px]'>
              Subscribe Now & Get 7-Day Free Access to All Features
            </p>

            <AllFunctionsAdvertisement />
          </section>

          <div className='flex justify-center items-center gap-6'>
            <Button className='w-[200px] h-10'>Try for Free</Button>
            <Button className='w-[200px] h-10 bg-opacity-30'>View All</Button>
          </div>
        </Container>
      </div>
    </>
  );
};

export default MainScreen;
