'use client';

import React, { useLayoutEffect, useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import Image from 'next/image';

import Container from '@/components/UI/Container';
import Paper from '@/components/UI/Paper';
import { Option, Select } from '@/components/UI/Select';
import Button from '@/components/UI/Button';
import ButtonGroup from '@/components/UI/ButtonGroup';

import LiveItem from '@/screens/CoinScreen/components/LiveItem';

import FeaturesInterest from '@/assets/coins-stats/futures-interest.svg';
import BtcVolume from '@/assets/coins-stats/btc-volume.svg';
import FeaturesTransactions from '@/assets/coins-stats/futures-transactions.svg';
import LiquidationBtc from '@/assets/indexes/liquidation-btc.svg';

import BtcIcon from '@/assets/coins/icon-btc.png';
import EthIcon from '@/assets/coins/icon-eth.png';
import SolIcon from '@/assets/coins/icon-sol.png';

import StarIcon from '@/assets/icons/icon-star.svg';
import HintIcon from '@/assets/icons/icon-hint.svg';
import MiniChartIcon from '@/assets/coins-stats/mini-chart-icon.svg';
import ChartIcon from '@/assets/icons/icon-charts-2.svg';
import CandlesticksIcon from '@/assets/icons/icon-candlesticks.svg';
import ChartArrowUp from '@/assets/icons/icon-chart-arrow-up.svg';
import ChartArrowDown from '@/assets/icons/icon-chart-arrow-down.svg';
import LongShortChart from './components/LongShortChart';
import LiquidationBtcRadarChart from './components/LiquidationBtcRadarChart';
import GeneralLiquidationChart from './components/GeneralLiquidationChart';
import { AveragePeriod, IntraDayPeriod } from '@/types';
import {
  useGetLatestHistoricalQuotesQuery,
  useGetLatestQuoteQuery,
  useGetLongShortRatioQuery,
} from '@/store/api/cryptoApi';
import { formatCurrency } from '@/utils/helpers/formatCurrency';
import ProcentLabel from '@/components/UI/ProcentLabel';
import { formatCurrencyShort } from '@/utils/helpers/formatCurrencyShort';
import { useTimeParams } from '@/hooks/useTimeParams';
import PriceLineChart from './components/PriceLineChart';
import { useRouter } from 'next/navigation';

//mock
import GreenChart from './mock/green-chart.svg';
import BtcPriceMock from './mock/BTC_PPRICE_MOCK.svg';
import UsSpotMock from './mock/US_SPOT_MOCK.svg';
import RealizedPriceMock from './mock/REALIZED_PRICE_MOCK.svg';
import MrvZMock from './mock/MVRV_Z_SCORE.svg';
import BalanceOnExchanges from './mock/BALANCE_ON_EXCHANGES.svg';
import NetUnrealezaed from './mock/NET_UNREALIZED.svg';
import TotalTrasferVolume from './mock/TOTAL_TRANSFER_VOLUME.svg';
import ActiveAdressMomentum from './mock/ACTIVE_ADRESS_MOMENTUM.svg';
import NumberOfAdress from './mock/NUMBER_OF_ADRES.svg';
import MeanHashRate from './mock/MEAN_HASH_RATE.svg';
import FutureInterset from './mock/FUTURE_OPEN_INTERSET.svg';
import FutureFunding from './mock/FUTURE_PERPETUAL_FUNDING.svg';
import SpotVolume from './mock/SPOT_VOLUME.svg';
import SpotVolumeDelta from './mock/SPOT_VOLUME_DELTA.svg';
import FearIndex from './mock/FEAR_GREED_INDEX.svg';
import CoinDominance from './mock/COIN_DOMINANCE.svg';
import Dropdown from '@/components/UI/Dropdown';

interface CoinScreenProps {
  slug: string;
  symbol?: string;
}

const items = Array.from({ length: 3 }, (_, index) => index + 1);

const coinsOptions: Option[] = [
  { label: 'BTC', value: 'btc', icon: <Image src={BtcIcon} alt='BTC' width={24} height={24} /> },
  { label: 'ETH', value: 'eth', icon: <Image src={EthIcon} alt='ETH' width={24} height={24} /> },
  { label: 'SOL', value: 'sol', icon: <Image src={SolIcon} alt='SOL' width={24} height={24} /> },
];

const optionsTime: Option<IntraDayPeriod>[] = [
  { label: '5 minutes', value: '5m' },
  { label: '15 minutes', value: '15m' },
  { label: '30 minutes', value: '30m' },
  { label: '1 hour', value: '1h' },
  { label: '2 hours', value: '2h' },
  { label: '4 hours', value: '4h' },
  { label: '6 hours', value: '6h' },
  { label: '12 hours', value: '12h' },
  { label: '24 hours', value: '1d' },
];

const optionsValue: Option<AveragePeriod>[] = [
  { label: 'All', value: 'all' },
];

const mockCards = [
  { title: 'Average price', value: '10 404 933,17 ₽', isPositive: null },
  { title: 'Highest price', value: '10 643 836,18 ₽', isPositive: null },
  { title: 'Buy volume', value: '1.13Т ₽ (49.54%)', isPositive: true },
  { title: 'Total volume', value: '2.3Т ₽', isPositive: null },
  { title: 'Buy orders', value: 'Рост 54.99%', isPositive: true },
  { title: '10d volatility', value: '0.32%', isPositive: null },
  { title: 'Price change', value: '-0.56%', isPositive: false },
  { title: 'lowest price', value: '9 995 869,06 ₽', isPositive: null },
  { title: 'sell volume', value: '1.15Т ₽ (50.46%)', isPositive: false },
  { title: 'volume change', value: 'Рост 66.5%', isPositive: true },
  { title: 'sell orders', value: 'Рост 72.96%', isPositive: false },
];

const mockExchanges = [
  { indicator: 'lavenderIndigo', name: 'Binance Futures' },
  { indicator: 'chartBlue', name: 'ByBit Futures' },
  { indicator: 'chartPink', name: 'BitMex' },
  { indicator: 'chartGreen', name: 'OKX' },
  { indicator: 'chartOrange', name: 'BitFinex' },
  { indicator: 'chartPurple', name: '—' },
  { indicator: 'chartLightBlue', name: '—' },
  { indicator: 'chartLightPink', name: '—' },
  { indicator: 'chartMint', name: '—' },
  { indicator: 'chartYellow', name: '—' },
];

const moreButtons: Option<AveragePeriod>[] = [
  { label: '1D', value: '1d' },
  { label: '7D', value: '7d' },
  { label: '1М', value: '1m' },
  { label: '1Y', value: '1y' },
  { label: 'ALL', value: 'all' },
];

const priceButtons = [
  { label: 'Price', value: 'price' },
  { label: 'Tyrian Trade', value: 'axa' },
];

const switchButtons = [
  { label: <ChartIcon />, value: 'chart' },
  { label: <CandlesticksIcon />, value: 'candlesticks' },
];

const exchangesWithNames = mockExchanges.filter((exchange) => exchange.name !== '—');
const exchangesWithDashes = mockExchanges.filter((exchange) => exchange.name === '—');

const CoinScreen = ({ slug, symbol }: CoinScreenProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [priceActiveBtn, setPriceActiveBtn] = useState(priceButtons[0].value);
  const [switchActiveBtn, setSwitchActiveBtn] = useState(switchButtons[0].value);
  const [intervalActiveBtn, setIntervalActiveBtn] = useState(moreButtons[0].value);
  const [selectedCoin, setSelectedCoin] = useState(coinsOptions[0].value);
  const [selectedPeriod, setSelectedPeriod] = useState<IntraDayPeriod>(optionsTime[0].value);

  const router = useRouter();

  const { timeStart, timeEnd, interval, limit } = useTimeParams(intervalActiveBtn);

  const { data: latestQuote } = useGetLatestQuoteQuery(slug);

  const { data: longShortRatio } = useGetLongShortRatioQuery({
    symbol: `${symbol}USDT`,
    period: '5m',
  });

  const lastRatio = longShortRatio?.[longShortRatio.length - 1];
  const longValue = parseFloat(lastRatio?.longAccount || '0') * 100;
  const shortValue = parseFloat(lastRatio?.shortAccount || '0') * 100;

  useLayoutEffect(() => {
    console.log(symbol);
    if (!symbol) {
      router.push(`/`);
    }
  }, [symbol]);

  if (!latestQuote) return <div>Loading...</div>;

  return (
    <Container className='flex flex-col gap-6 pb-40 mt-12'>
      <div className='flex gap-6'>
        <Paper className='!p-0 max-w-[344px]'>
          <div className='p-4 flex items-start justify-between border-white border-b-2 border-opacity-10 pb-4'>
            <div className='flex flex-col gap-2'>
              <div className='flex align-top gap-2 items-start'>
                <div className='flex gap-2 items-center'>
                  <Image
                    src={latestQuote?.logo}
                    alt='BTC'
                    width={36}
                    height={36}
                    className='h-fit'
                  />
                  <div className='flex flex-col'>
                    <p className='ont-semibold'>{latestQuote?.name}</p>
                    <span className='font-semibold text-body-12 text-webGray'>
                      {latestQuote?.symbol}
                    </span>
                  </div>
                </div>
                <div className='text-body-12 font-bold p-1 rounded bg-white bg-opacity-10 flex justify-center items-center leading-none'>
                  #{latestQuote?.cmc_rank}
                </div>
              </div>
              <div className='flex flex-col gap-0.5 items-start'>
                <h2 className='text-h3 !font-bold'>
                  {formatCurrency(latestQuote?.quote.USD.price || 0)}
                </h2>
                <ProcentLabel
                className="text-body-12"
                  value={latestQuote?.quote.USD.percent_change_24h || 0}
                  symbolAfter='%'
                />
              </div>
            </div>
            <Button
              icon={
                <StarIcon
                  className={clsx('relative bottom-[2px]', {
                    'text-purple fill-purple': isFavorite,
                  })}
                />
              }
              onClick={() => setIsFavorite(!isFavorite)}
              size='sm'
              variant='shadow'
              className='!gap-1'
            >
              5M
            </Button>
          </div>
          <div className='p-4 grid grid-cols-2 gap-8 border-white border-b border-opacity-10'>
            <div className='flex flex-col items-start gap-2'>
              <div className='flex items-center gap-1.5'>
                <p className='text-body-12 font-semibold uppercase text-webGray'>Market cap</p>
                <HintIcon />
              </div>
              <div className='flex gap-2 items-center'>
                <p className='text-sh1 font-bold whitespace-nowrap'>
                  {formatCurrencyShort(latestQuote?.quote.USD.market_cap)}
                </p>
                <ProcentLabel className="text-body-12" value={latestQuote?.quote.USD.market_cap_dominance} symbolAfter='%' />
              </div>
            </div>
            <div className='flex flex-col items-start gap-2'>
              <div className='flex items-center gap-1.5'>
                <p className='text-body-12 font-semibold uppercase text-webGray'>VOLUME (24H)</p>
                <HintIcon />
              </div>
              <div className='flex gap-2 items-center'>
                <p className='text-sh1 font-bold whitespace-nowrap'>
                  {formatCurrencyShort(latestQuote?.quote.USD.volume_24h)}
                </p>
                <ProcentLabel className="text-body-12" value={latestQuote?.quote.USD.volume_change_24h} symbolAfter='%' />
              </div>
            </div>
          </div>
          <div className='p-4 grid grid-cols-2 gap-8 border-white border-b border-opacity-10'>
            <div className='flex flex-col items-start gap-2'>
              <div className='flex items-center gap-1.5'>
                <p className='text-body-12 font-semibold uppercase text-webGray'>FDV</p>
                <HintIcon />
              </div>
              <div className='flex gap-2 items-center'>
                <p className='text-sh1 font-bold'>{formatCurrencyShort(latestQuote?.fdv)}</p>
              </div>
            </div>
            <div className='flex flex-col items-start gap-2'>
              <div className='flex items-center gap-1.5'>
                <p className='text-body-12 font-semibold uppercase text-webGray'>Vol / Market cap</p>
                <HintIcon />
              </div>
              <div className='flex gap-2 items-center'>
                <p className='text-sh1 font-bold'>
                  {Number((latestQuote?.volume_market_cap * 100).toFixed(2))}%
                </p>
              </div>
            </div>
          </div>
          <div className='p-4 grid grid-cols-2 gap-8 border-white border-b border-opacity-10'>
            <div className='flex flex-col items-start gap-2'>
              <div className='flex items-center gap-1.5'>
                <p className='text-body-12 font-semibold uppercase text-webGray'>Total Supply</p>
                <HintIcon />
              </div>
              <div className='flex gap-2 items-center'>
                <p className='text-sh1 font-bold'>
                  {formatCurrencyShort(latestQuote?.total_supply, latestQuote?.symbol, true)}
                </p>
              </div>
            </div>
            <div className='flex flex-col items-start gap-2'>
              <div className='flex items-center gap-1.5'>
                <p className='text-body-12 font-semibold uppercase text-webGray'>Max supply</p>
                <HintIcon />
              </div>
              <div className='flex gap-2 items-center'>
                <p className='text-sh1 font-bold'>
                  {latestQuote?.max_supply
                    ? formatCurrencyShort(latestQuote?.max_supply || 0, latestQuote?.symbol, true)
                    : '- -'}
                </p>
              </div>
            </div>
          </div>
          <div className='p-4 flex gap-8 border-white border-b-2 border-opacity-10'>
            <div className='flex flex-col items-start gap-2'>
              <div className='flex items-center gap-1.5'>
                <p className='text-body-12 font-semibold uppercase text-webGray'>Circulating supply</p>
                <HintIcon />
              </div>
              <div className='flex gap-2 items-center'>
                <p className='text-sh1 font-bold'>
                  {formatCurrencyShort(latestQuote?.circulating_supply, latestQuote?.symbol, true)}
                </p>
                <MiniChartIcon />
              </div>
            </div>
          </div>
          <div className='flex flex-col px-4 pt-4 gap-[18px]'>
            <div className='flex items-center gap-1.5'>
              <p className='font-semibold'>Community sentiment</p>
              <div className='text-body-12 font-bold p-1 rounded bg-white bg-opacity-10 flex justify-center items-center leading-none'>
              1.2M votes
              </div>
            </div>
            <div className='flex justify-between items-end gap-1'>
              <div className='flex gap-0.5 items-center'>
                <ChartArrowUp />
                <p className='text-body-15 text-mountainMeadow font-semibold'>50%</p>
              </div>
              <div className='flex items-center gap-0.5'>
                <div className='w-[99px] h-[24px] bg-mountainMeadow rounded-l-[8px]' />
                <div className='w-[99px] h-[24px] bg-fieryRose rounded-r-[8px]' />
              </div>
              <div className='flex gap-0.5 items-center'>
                <p className='text-body-15 text-fieryRose font-semibold'>50%</p>
                <ChartArrowDown />
              </div>
            </div>
          </div>
        </Paper>
        <Paper className='relative w-[712px] px-4 '>
          <div className='pb-2 border-white border-b border-opacity-10'>
            <h3 className='text-2xl font-bold'>Chart</h3>
          </div>
          <div className='flex justify-between pt-4 pb-6'>
            <div className='flex gap-6'>
              <ButtonGroup>
                {priceButtons.map((button) => (
                  <Button
                    key={button.value}
                    variant={priceActiveBtn === button.value ? 'primary' : 'shadow'}
                    size='sm'
                    onClick={() => setPriceActiveBtn(button.value)}
                  >
                    {button.label}
                  </Button>
                ))}
              </ButtonGroup>
              <ButtonGroup>
                {switchButtons.map((button) => (
                  <Button
                    key={button.value}
                    variant={switchActiveBtn === button.value ? 'primary' : 'shadow'}
                    size='sm'
                    icon={button.label}
                    onClick={() => setSwitchActiveBtn(button.value)}
                  />
                ))}
              </ButtonGroup>
            </div>
            <ButtonGroup>
              {moreButtons.map((button) => (
                <Button
                  key={button.value}
                  variant={intervalActiveBtn === button.value ? 'primary' : 'shadow'}
                  size='sm'
                  onClick={() => setIntervalActiveBtn(button.value)}
                >
                  {button.label}
                </Button>
              ))}
            </ButtonGroup>
          </div>
          <PriceLineChart
            symbol={symbol!}
            slug={slug}
            timeStart={timeStart}
            timeEnd={timeEnd}
            interval={interval}
            limit={limit}
          />
<GreenChart className='absolute bottom-12'/>
        </Paper>
      </div>
      <div className='flex gap-4'>
        <Paper className='flex flex-col w-[210px] gap-4 flex-1'>
          <p className='text-body-12 font-semibold uppercase text-webGray'>long liquidations</p>
          <p className='text-body-15 font-bold text-mountainMeadow'>{longValue.toFixed(2)}%</p>
        </Paper>
        <Paper className='flex flex-col w-[210px] gap-4 flex-1'>
          <p className='text-body-12 font-semibold uppercase text-webGray'>total</p>
          <p className='text-body-15 font-bold'>
            - <span className='text-webGray'>/</span> -
          </p>
        </Paper>
        <Paper className='flex flex-col w-[210px] gap-4 flex-1'>
          <p className='text-body-12 font-semibold uppercase text-webGray'>short liquidations</p>
          <p className='text-body-15 font-bold text-fieryRose'>{shortValue.toFixed(2)}%</p>
        </Paper>
      </div>
      <div className='flex gap-6'>
        <Paper className='flex-1'>
          <div className='flex items-center gap-4'>
            <Dropdown
              text='BTC'
            />
            <h3 className='text-h4 font-bold'> {symbol} Liquidations Across Exchanges</h3>
          </div>
          <div className='flex gap-[46px] items-center mt-8'>
            <LiquidationBtcRadarChart />
            <div className='flex flex-col gap-4'>
              <p className='font-semibold text-body-12 text-webGray uppercase'>Excange list</p>
              <div className="grid grid-cols-[3fr_1fr] gap-4">
                <div className='flex flex-col gap-4'>
                  {exchangesWithNames.map((exchange, index) => (
                    <div key={index} className='flex items-center gap-4'>
                      <div
                        className='w-3 h-3 rounded-full'
                        style={{ backgroundColor: exchange.indicator }}
                      />
                      <p>{exchange.name}</p>
                    </div>
                  ))}
                </div>

                <div className='flex flex-col gap-4'>
                  {exchangesWithDashes.map((exchange, index) => (
                    <div key={index} className='flex items-center gap-4'>
                      <div
                        className='w-3 h-3 rounded-full'
                        style={{ backgroundColor: exchange.indicator }}
                      />
                      <p>{exchange.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Paper>
        <Paper>
          <h3 className='font-bold text-2xl'> {symbol} Liqudations</h3>
          <p className='text-body-12 font-semibold text-webGray'>
            24H Total Data - Total: <span className='text-white'>99.8М</span>
          </p>
          <LiquidationBtc />
        </Paper>
      </div>
      <div className='flex items-start gap-6'>
        <div className='grid grid-cols-3 gap-2'>
          {mockCards.map((item) => (
            <Paper key={item.value} className='flex p-4 flex-col w-[171px] h-[92px] gap-4'>
              <p className='text-body-12 font-semibold uppercase text-webGray'>{item.title}</p>
              <p
                className={clsx('text-body-15 font-bold', {
                  'text-mountainMeadow': item.isPositive === true,
                  'text-fieryRose': item.isPositive === false,
                })}
              >
                {item.value}
              </p>
            </Paper>
          ))}
        </div>
        <Paper className='max-w-[528px] px-0 flex flex-col flex-1'>
          <div className='flex justify-between items-center pb-4 px-6 border-white border-b border-opacity-10'>
            <h3 className='font-bold text-2xl'>Live Translation (4H)</h3>
            <Link href='/' className='text-lavenderIndigo text-body-15 font-bold underline'>
              Show all
            </Link>
          </div>
          {items.map((item) => (
            <LiveItem symbol={symbol!} key={item} />
          ))}
        </Paper>
      </div>
      <Paper className='!p-0 flex flex-col gap-6 w-full h-[1127px] !bg-[url("/mock-block-solana.svg")] bg-cover bg-center' />
      <Paper className='!p-0 flex flex-col gap-6 w-full h-[428px] !bg-[url("/mock-block-nft-solana.png")] bg-cover bg-center' />
      <Paper className='!p-0 flex flex-col gap-6 w-full h-[385px] !bg-[url("/mock-block-white-book.png")] bg-cover bg-center' />
      <Paper>
        <div className='flex justify-between items-center pb-4'>
          <div className='flex flex-col w-fit gap-4'>
            <h3 className='font-bold text-2xl'>Long/Short Chart</h3>
            <div className='flex gap-4 items-center justify-center'>
              <div className='flex gap-1.5 items-center'>
                <div className='w-2 h-2 rounded-full bg-fieryRose' />
                <p className='text-body-12 font-semibold text-webGray uppercase'>Short</p>
              </div>
              <div className='flex gap-1.5 items-center'>
                <div className='w-2 h-2 rounded-full bg-webGray' />
                <p className='text-body-12 font-semibold text-webGray uppercase'>Long</p>
              </div>
            </div>
          </div>
          <div className='flex gap-4'>
          <Select
              value={selectedPeriod}
              options={optionsValue}
              placeholder='All'
              onChange={(val) => {
                setSelectedPeriod(val.value as IntraDayPeriod);
              }}
              disabled={true}
            />
            <Select
              value={selectedPeriod}
              options={optionsTime}
              onChange={(val) => {
                setSelectedPeriod(val.value as IntraDayPeriod);
              }}
              placeholder='Выберите опцию'
            />
          </div>
        </div>
        <LongShortChart symbol={symbol!} timePeriod={selectedPeriod} />
      </Paper>
      <Paper>
        <div className='flex justify-between items-center pb-4'>
          <div className='flex flex-col w-fit gap-4'>
            <h3 className='font-bold text-2xl'>Total Liquidation Chart</h3>
            <div className='flex gap-4 items-center justify-center'>
              <div className='flex gap-1.5 items-center'>
                <div className='w-2 h-2 rounded-full bg-cornflowerBlue' />
                <p className='text-body-12 font-semibold text-webGray uppercase'>Short</p>
              </div>
              <div className='flex gap-1.5 items-center'>
                <div className='w-2 h-2 rounded-full bg-[lavenderIndigo]' />
                <p className='text-body-12 font-semibold text-webGray uppercase'>Long</p>
              </div>
              <div className='flex gap-1.5 items-center'>
                <div className='w-2 h-2 rounded-full bg-orangePeel' />
                <p className='text-body-12 font-semibold text-webGray uppercase'>price</p>
              </div>
            </div>
          </div>
          <div className='flex gap-4'>
          <Select
              value={selectedPeriod}
              options={optionsValue}
              placeholder='All'
              onChange={(val) => {
                setSelectedPeriod(val.value as IntraDayPeriod);
              }}
              disabled={true}
            />
            <Select
              value={selectedPeriod}
              options={optionsTime}
              onChange={(val) => {
                setSelectedPeriod(val.value as IntraDayPeriod);
              }}
              placeholder='Выберите опцию'
            />
          </div>
        </div>
        <GeneralLiquidationChart />
      </Paper>
      <Paper className='flex flex-col gap-6'>
        <h3 className='font-bold text-2xl'>
          {symbol} BTC Futures Open Interest on Exchange (USD)
        </h3>
        <FeaturesTransactions />
      </Paper>
      <Paper className='flex flex-col gap-6'>
        <h3 className='font-bold text-2xl'> {symbol} Volume</h3>
        <BtcVolume />
      </Paper>
      <Paper className='flex flex-col gap-6'>
        <h3 className='font-bold text-2xl'> {symbol} Futures Trade Count</h3>
        <FeaturesInterest />
      </Paper>

      <div className='flex gap-6'>
        <BtcPriceMock />
        <UsSpotMock />
      </div>
      <div className='flex gap-6'>
        <RealizedPriceMock />
        <MrvZMock />
      </div>
      <div className='flex gap-6'>
        <BalanceOnExchanges />
        <NetUnrealezaed />
      </div>
      <div className='flex gap-6'>
        <TotalTrasferVolume />
        <ActiveAdressMomentum />
      </div>
      <div className='flex gap-6'>
        <MeanHashRate />
        <NumberOfAdress />
      </div>
      <div className='flex gap-6'>
        <FutureInterset />
        <FutureFunding />
      </div>
      <div className='flex gap-6'>
        <SpotVolume />
        <SpotVolumeDelta />
      </div>
      <div className='flex gap-6'>
        <FearIndex />
        <CoinDominance />
      </div>
    </Container>
  );
};

export default CoinScreen;
