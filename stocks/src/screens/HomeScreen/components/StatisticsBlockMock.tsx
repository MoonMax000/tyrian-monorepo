// import { PeperDetailsResponse, StocksService } from '@/services/StocksService';
// import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import CardWithDetails from '@/components/UI/CardWithDetails';
import RangeSlider from '@/components/UI/RangeSlider';
import ModalV2 from '@/components/UI/ModalV2';
import { formatCurrency } from '@/helpers/formatCurrency';
import { TradingVolumesModal } from './TradingVolumesModal';

const determinateAmountValue = (amount: number): string => {
  if (amount > 1000000 && amount < 1000000000) {
    const value = (amount / 1000000).toFixed(2);
    return `${value} M`;
  }
  if (amount > 1000000000) {
    const value = (amount / 1000000000).toFixed(2);
    return `${value} B`;
  }
  return formatCurrency(amount, {
    minimumFractionDigits: 2,
  });
};

const StatisticsBlock = () => {
  const pathname = usePathname();
  const path = pathname.split('/').pop();
  const stockSymbol = path || 'SBER';

  const [stockInfo, setStockInfo] = useState({
    value_today: '$11 521 250 207',
    high_price: 325.6,
    low_price: 311.2,
    board_id: '2%',
    isin: '$210T',
  });

  const [tradingModalVisible, setTradingModalVisible] = useState(false);

  const toggleTradingModal = () => setTradingModalVisible((prev) => !prev);

  const avgPrice = (stockInfo.high_price + stockInfo.low_price) / 2;

  const mockData = [
    {
      title: 'Price range today',
      Component: (
        <RangeSlider
          min={stockInfo.low_price}
          max={stockInfo.high_price}
          value={avgPrice}
          step={0.1}
          disabled
        />
      ),
      onClick: () => {},
    },
    {
      title: 'today’s trading volume',
      Component: <span className='text-white text-[15px] font-bold'>{stockInfo.value_today}</span>,
      onClick: toggleTradingModal,
    },
    {
      title: 'Dividends',
      Component: <span className='text-white text-[15px] font-bold'>{stockInfo.board_id}</span>,
      onClick: () => {},
    },
    {
      title: 'Market Cap',
      Component: (
        <div className='flex items-center gap-x-2 text-[15px] font-bold'>
          <span className='text-white'>{stockInfo.isin}</span>
          <span className='text-red'>(-$1.1Т)</span>
        </div>
      ),
      onClick: () => {},
    },
  ];

  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[minmax(320px,1fr)_1fr_1fr_1fr] gap-[23px] mt-6'>
        {mockData.map(({ Component, ...props }, i) => (
          <CardWithDetails key={i} {...props} className='flex-1'>
            {Component}
          </CardWithDetails>
        ))}
      </div>
      <ModalV2
        isOpen={tradingModalVisible}
        onClose={toggleTradingModal}
        title='Trading Volumes'
        contentClassName='pt-4 border-[1px] border-gunpowder'
        withCloseButton
      >
        <TradingVolumesModal />
      </ModalV2>
    </>
  );
};

export default StatisticsBlock;
