'use client';

import Container from '@/components/UI/Container';
import Paper from '@/components/UI/Paper';
import IconHint from '@/assets/icons/icon-hint.svg';
import ButtonGroup from '@/components/UI/ButtonGroup';
import Button from '@/components/UI/Button';
import DominateScale from '@/components/DominateScale';

import DominateBtcIndex from '@/assets/indexes/dominate-btc.svg';

const BtcDominanceScreen = () => {
  return (
    <Container className='mb-40'>
      <div className='flex justify-between mt-12 '>
        <div className='flex flex-col gap-4 max-w-[540px]'>
          <h1 className='text-[40px] font-bold'> BTC Dominance </h1>
          <p className='text-[15px] font-bold text-webGray'>
            Bitcoin Dominance (BTC) is a metric used to measure Bitcoin's relative share of the
            overall cryptocurrency market. It represents the percentage of Bitcoin's total market
            capitalization compared to the total market capitalization of all cryptocurrencies
            combined.
          </p>
        </div>
        <Paper className='w-[417px] flex flex-col gap-4 h-fit'>
          <div className='flex items-center gap-1'>
            <h5 className='font-bold text-[15px]'>Fear and Greed Index</h5>
            <IconHint />
          </div>
          <DominateScale />
        </Paper>
      </div>
      <div className='pt-12'>
        <div className='flex justify-between'>
          <Paper>
            <div className='flex justify-between items-center'>
              <h3 className='font-bold text-2xl'>BTC Dominance Chart</h3>
              <div className='flex gap-6'>
                <ButtonGroup>
                  <Button variant='shadow' size='sm' className='text-xs'>
                    {' '}
                    1М{' '}
                  </Button>
                  <Button variant='shadow' size='sm' className='text-xs'>
                    {' '}
                    1T{' '}
                  </Button>
                  <Button variant='primary' size='sm' className='text-xs'>
                    {' '}
                    ALL{' '}
                  </Button>
                </ButtonGroup>
              </div>
            </div>
            <div className='flex gap-4 py-4'>
              <div className='flex items-center gap-1.5'>
                <div className='size-[6px] rounded-full bg-purple' />
                <p className='text-xs font-bold text-webGray uppercase'>Bitcoin</p>
              </div>
              <div className='flex items-center gap-1.5'>
                <div className='size-[6px] rounded-full bg-cornflowerBlue' />
                <p className='text-xs font-bold text-webGray uppercase'>Ethereum</p>
              </div>
              <div className='flex items-center gap-1.5'>
                <div className='size-[6px] rounded-full bg-[#4F5156]' />
                <p className='text-xs font-bold text-webGray uppercase'>Others</p>
              </div>
            </div>
            <DominateBtcIndex className='select-none pointer-events-none' />
          </Paper>
        </div>
      </div>
    </Container>
  );
};

export default BtcDominanceScreen;
