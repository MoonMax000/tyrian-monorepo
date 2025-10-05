'use client';

import HorizontalAltmeter from '@/components/HorizontalAltmeter';
import Button from '@/components/UI/Button';
import ButtonGroup from '@/components/UI/ButtonGroup';
import Container from '@/components/UI/Container';
import Paper from '@/components/UI/Paper';

import IconHint from '@/assets/icons/icon-hint.svg';
import AltIndex from '@/assets/indexes/alt.svg';
import TopCoinLabel from './components/TopCoinLabel';

const AltSeasonScreen = () => {
  const topCoins = [
    { name: 'XCN', percentage: 200000.0 },
    { name: 'HYPE', percentage: -696.53 },
    { name: 'BERA', percentage: 505.32 },
    { name: 'BGB', percentage: 269.67 },
    { name: 'TRUMP', percentage: 168.17 },
    { name: 'XRP', percentage: 142.82 },
    { name: 'VIRTUAL', percentage: 138.41 },
    { name: 'GT', percentage: 137.07 },
    { name: 'XDC', percentage: 127.42 },
    { name: 'DEXE', percentage: 89.05 },
    { name: 'OM', percentage: 74.44 },
    { name: 'AAVE', percentage: 63.21 },
    { name: 'HBAR', percentage: 57.48 },
    { name: 'LDO', percentage: 55.96 },
    { name: 'ENS', percentage: 51.93 },
    { name: 'XMR', percentage: 48.08 },
    { name: 'SFX', percentage: 47.41 },
    { name: 'XLM', percentage: 45.0 },
    { name: 'CAKE', percentage: 40.31 },
    { name: 'LTC', percentage: 40.1 },
    { name: 'MNT', percentage: 39.46 },
    { name: 'LINK', percentage: 30.86 },
    { name: 'IOTA', percentage: 29.3 },
    { name: 'CRV', percentage: 26.73 },
    { name: 'ONDO', percentage: 24.46 },
    { name: 'LEO', percentage: 24.25 },
    { name: 'TRX', percentage: 20.59 },
    { name: 'ALGO', percentage: 19.45 },
    { name: 'OKB', percentage: 15.38 },
    { name: 'SAND', percentage: 15.32 },
    { name: 'ADA', percentage: 11.31 },
    { name: 'KCS', percentage: 11.25 },
    { name: 'XAUT', percentage: 10.19 },
    { name: 'BNB', percentage: 9.27 },
    { name: 'NEXO', percentage: 9.16 },
    { name: 'UNI', percentage: 5.31 },
    { name: 'FTT', percentage: 4.94 },
    { name: 'QNT', percentage: 3.73 },
    { name: 'FLR', percentage: 3.7 },
    { name: 'BTC', percentage: 3.69 },
    { name: 'JASMY', percentage: 2.74 },
    { name: 'VET', percentage: 0.01 },
    { name: 'EOS', percentage: -0.01 },
    { name: 'ITO', percentage: -4.39 },
    { name: 'RON', percentage: -8.8 },
    { name: 'ETH', percentage: -11.5 },
    { name: 'SUI', percentage: -11.65 },
    { name: 'KAIA', percentage: -12.46 },
    { name: 'NEO', percentage: -13.59 },
    { name: 'XTZ', percentage: -15.09 },
    { name: 'DOT', percentage: -15.26 },
    { name: 'RAY', percentage: -15.66 },
    { name: 'ENA', percentage: -15.65 },
    { name: 'MOVE', percentage: -17.78 },
    { name: 'MANA', percentage: -17.86 },
    { name: 'ETC', percentage: -19.16 },
    { name: 'BTT', percentage: -21.5 },
    { name: 'AXS', percentage: -22.23 },
    { name: 'THETA', percentage: -22.75 },
    { name: 'ATOM', percentage: -22.94 },
    { name: 'FIL', percentage: -22.85 },
    { name: 'ICP', percentage: -23.22 },
    { name: 'GALA', percentage: -23.72 },
    { name: 'SOL', percentage: -24.99 },
    { name: 'TAO', percentage: -25.08 },
    { name: 'POL', percentage: -25.64 },
    { name: 'MATIC', percentage: -25.64 },
    { name: 'FLOW', percentage: -25.69 },
    { name: 'S', percentage: -26.4 },
    { name: 'AVAX', percentage: -26.74 },
    { name: 'BCH', percentage: -26.76 },
    { name: 'ARB', percentage: -28.28 },
    { name: 'EGLD', percentage: -28.7 },
    { name: 'MKR', percentage: -30.35 },
    { name: 'JUP', percentage: -30.94 },
    { name: 'TON', percentage: -31.11 },
    { name: 'OP', percentage: -32.43 },
    { name: 'DOGE', percentage: -33.88 },
    { name: 'KAS', percentage: -34.34 },
    { name: 'AERO', percentage: -36.03 },
    { name: 'HNT', percentage: -36.59 },
    { name: 'SHIB', percentage: -37.09 },
    { name: 'INJ', percentage: -37.55 },
    { name: 'IMX', percentage: -39.4 },
    { name: 'TIA', percentage: -40.36 },
    { name: 'GRT', percentage: -40.64 },
    { name: 'FET', percentage: -40.68 },
    { name: 'NEAR', percentage: -42.31 },
    { name: 'BSV', percentage: -42.35 },
    { name: 'RENDER', percentage: -43.92 },
    { name: 'WLD', percentage: -46.2 },
    { name: 'CRO', percentage: -47.2 },
    { name: 'APT', percentage: -48.74 },
    { name: 'PYTH', percentage: -48.94 },
    { name: 'PEPE', percentage: -49.88 },
    { name: 'STX', percentage: -51.23 },
    { name: 'SEI', percentage: -52.94 },
    { name: 'FLOKI', percentage: -61.29 },
    { name: 'BONK', percentage: -68.83 },
    { name: 'WIF', percentage: -200000.0 },
  ];

  const positiveCoins = topCoins
    .filter((coin) => coin.percentage >= 0)
    .sort((a, b) => b.percentage - a.percentage);

  const negativeCoins = topCoins
    .filter((coin) => coin.percentage < 0)
    .sort((a, b) => b.percentage - a.percentage);

  return (
    <Container className='mb-40'>
      <div className='flex justify-between mt-12 '>
        <div className='flex flex-col gap-4 max-w-[540px]'>
          <h1 className='text-[40px] font-bold'>Alt-Season Index</h1>
          <p className='text-[15px] font-bold text-webGray'>
            The Alt Season Index page shows whether the crypto market is currently in an alt season
            by analyzing the performance of the top 100 altcoins against Bitcoin over the past 90
            days. Here you will find detailed charts and metrics to track market trends and the
            level of altcoin dominance.
          </p>
        </div>
        <Paper className='w-[417px] flex flex-col gap-4 h-fit'>
          <div className='flex items-center gap-1'>
            <h5 className='font-bold text-[15px]'>Alt-Season Index</h5>
            <IconHint />
          </div>
          <HorizontalAltmeter value={50} />
        </Paper>
      </div>
      <div className='pt-12'>
        <div className='flex justify-between'>
          <Paper>
            <div className='flex justify-between items-center'>
              <h3 className='font-bold text-2xl'>Fear and Greed Index Chart</h3>
              <div className='flex gap-6'>
                <ButtonGroup>
                  <Button variant='shadow' size='sm' className='text-xs'>
                    7D
                  </Button>
                  <Button variant='shadow' size='sm' className='text-xs'>
                    1M
                  </Button>
                  <Button variant='primary' size='sm' className='text-xs'>
                    3M
                  </Button>
                </ButtonGroup>
              </div>
            </div>
            <div className='flex gap-4 py-4'>
              <div className='flex items-center gap-1.5'>
                <div className='size-[6px] rounded-full bg-cornflowerBlue' />
                <p className='text-xs font-bold text-webGray uppercase'>Alt-Season Index</p>
              </div>
              <div className='flex items-center gap-1.5'>
                <div className='size-[6px] rounded-full bg-webGray' />
                <p className='text-xs font-bold text-webGray uppercase'>
                  Ryn. Altcoin capitalization
                </p>
              </div>
            </div>
            <AltIndex className='select-none pointer-events-none' />
          </Paper>
        </div>
        <div className='flex flex-col gap-12 pt-12'>
          <h2 className='font-bold text-[40px]'>TOP 100 coins for the last 90 days</h2>
          <div className='flex flex-wrap gap-2 w-full'>
            {positiveCoins.map((coin) => (
              <TopCoinLabel key={coin.name} name={coin.name} percentage={coin.percentage} />
            ))}
            {negativeCoins.map((coin) => (
              <TopCoinLabel key={coin.name} name={coin.name} percentage={coin.percentage} />
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default AltSeasonScreen;
