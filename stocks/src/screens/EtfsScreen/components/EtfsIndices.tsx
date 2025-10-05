import Card, { type CardData } from '@/components/UI/Card';
import PopularList, { type PopularListItem } from '@/components/UI/PopularList';

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

const popularList: PopularListItem[] = [
  {
    name: 'Apple Inc.',
    price: 201.7,
    profit: 0.42,
  },
  {
    name: 'Alphabet Inc.',
    price: 169.03,
    profit: -1.58,
  },
  {
    name: 'Amazon.com Inc.',
    price: 206.65,
    profit: -0.8,
  },
  {
    name: 'Nvidia',
    price: 137.38,
    profit: 1.67,
  },
  {
    name: 'Tesla Inc.',
    price: 342.69,
    profit: -1.09,
  },
];

const EtfsFunds = () => {
  return (
    <section className='stock-indices flex flex-col lg:flex-row gap-6 mt-10'>
      <div className='stock-indices__cards grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 grow'>
        <div className='stock-indices__title lg:col-span-2 flex flex-col justify-end'>
          <span className='text-[19px] font-bold text-purple mb-auto'>USA Market</span>
          <h2 className='text-[31px] font-bold'>ETFs&Funds</h2>
          <p className='text-webGray font-medium text-[15px]'>
            Your money keeps working while you live.
          </p>
        </div>
        {[...new Array(4).fill(null)].map((_, index) => (
          <Card key={index} data={mockStockIndicesData} title='Bitcoin' />
        ))}
      </div>
      <PopularList items={popularList} link='#' title='Popular Etfs' />
    </section>
  );
};

export default EtfsFunds;
