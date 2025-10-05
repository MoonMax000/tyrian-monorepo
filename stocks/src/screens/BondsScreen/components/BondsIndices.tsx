'use client';
import Card, { type CardData } from '@/components/UI/Card';
import PopularList, { type PopularListItem } from '@/components/UI/PopularList';
import { Bond, StocksService } from '@/services/StocksService';
import { useQuery } from '@tanstack/react-query';

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

const BondsIndices = () => {
  const { data: corporateBondsData } = useQuery({
    queryKey: ['corp-bonds'],
    queryFn: () => StocksService.corporateBonds('All Bonds'),
  });

  const transformDataToPopularListValues = (data?: Bond[]): PopularListItem[] | undefined => {
    return data?.map((item) => ({
      name: item.document_eng,
      price: Number(item.price_of_primary_placing) ?? 0,
      profit: Number(item.curr_coupon_rate),
    }));
  };

  const popularListItems = transformDataToPopularListValues(corporateBondsData?.data.data)?.slice(
    0,
    5,
  );

  return (
    <section className='stock-indices flex flex-col lg:flex-row gap-6 mt-10'>
      <div className='stock-indices__cards grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 grow'>
        <div className='stock-indices__title lg:col-span-2 flex flex-col justify-end'>
          <span className='text-[19px] font-bold text-purple'>USA Market</span>
          <h2 className='text-[31px] font-bold'>Government & Corporate Bonds</h2>
          <p className='text-webGray font-medium text-[15px]'>
            Your money keeps working while you live.
          </p>
        </div>
        {corporateBondsData?.data.data
          ?.slice(0, 4)
          .map((item, index) => (
            <Card key={index} data={mockStockIndicesData} title={item.document_eng} />
          ))}
      </div>
      {popularListItems && <PopularList items={popularListItems} link='#' title='Popular Bonds' />}
    </section>
  );
};

export default BondsIndices;
