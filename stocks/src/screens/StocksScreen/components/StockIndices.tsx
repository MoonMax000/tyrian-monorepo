import Card, { type CardData } from '@/components/UI/Card';
import PopularList, { type PopularListItem } from '@/components/UI/PopularList';
import { FC } from 'react';

const mockStockIndicesData: CardData[] = [
  { date: '13:00', price: 2500 },
  { date: '14:00', price: 2620 },
  { date: '15:00', price: 2801 },
  { date: '16:00', price: 2580 },
  { date: '17:00', price: 2630 },
  { date: '18:00', price: 2530 },
  { date: '19:00', price: 3450 },
  { date: '20:00', price: 3460 },
  { date: '21:00', price: 3550 },
  { date: '22:00', price: 3670 },
  { date: '23:00', price: 3780 },
  { date: '00:00', price: 3800 },
];

const mockCards = [
  {
    id: 0,
    name: 'Apple Inc.',
  },
  {
    id: 1,
    name: 'Alphabet Inc.',
  },
  {
    id: 2,
    name: 'Amazon.com Inc.',
  },
  {
    id: 3,
    name: 'Nvidia',
  },
];

interface Props {
  data: PopularListItem[] | [];
  isLoading?: boolean;
}

const StockIndices: FC<Props> = ({ data, isLoading = true }) => {
  return (
    <section className='stock-indices flex flex-col lg:flex-row gap-6 mt-10'>
      <div className='stock-indices__cards grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 grow'>
        <div className='stock-indices__title lg:col-span-2 flex flex-col justify-end'>
          <span className='text-[19px] font-bold text-purple mb-auto'>USA Market</span>
          <h2 className='text-[31px] font-bold'>Indices</h2>
          <p className='text-webGray font-medium text-[15px]'>
            Your money keeps working while you live.
          </p>
        </div>
        {mockCards.map((item, index) => (
          <Card key={index} data={mockStockIndicesData} title={item.name} />
        ))}
      </div>

      <PopularList items={data} link='#' title='Popular Stocks' isLoading={isLoading} />
    </section>
  );
};

export default StockIndices;
