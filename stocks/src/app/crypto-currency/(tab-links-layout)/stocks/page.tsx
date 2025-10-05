import StockScreen from '@/screens/StocksScreen';
import { Suspense } from 'react';

export default function Stocks() {
  return (
    <Suspense>
      <StockScreen />
    </Suspense>
  );
}
