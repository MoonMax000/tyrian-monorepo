'use client';

import Container from '@/components/UI/Container';
import Accordions from './components/Accordions';
import StocksSelectAndData from './components/StocksSelectAndData';
import { StockComparisonDiagram } from './components/StockComparsionDiagram';
import { CryptoCurrencyBackground } from '@/components/Backgrounds';

const StocksComparision = () => {
  return (
    <Container className='pb-[64px]'>
      <h1 className='text-[56px] font-bold mb-8'>Stock Comparison</h1>
      <CryptoCurrencyBackground />
      <StocksSelectAndData />
      <StockComparisonDiagram />
      <Accordions />
    </Container>
  );
};

export default StocksComparision;
