import { FC } from 'react';
import { ViewAll } from '../UI/ViewAll/ViewAll';
import { StocksCard } from '../StocksCard/StocksCard';
import { StocksValues } from '@/screens/MainContent/mockData';
import { useRouter } from 'next/navigation';

interface Props {
  title?: string;
  onClick?: () => void;
  content: StocksValues[];
  isStocks?: boolean;
}

export const StocksBlock: FC<Props> = ({ title, content, onClick, isStocks = false }) => {
  const { push } = useRouter();
  return (
    <div className='flex flex-col w-[487px] min-h-full h-fit rounded-[24px] border border-[#523A83] backdrop-blur-[100px]'>
      <div className='flex w-full items-center pb-3 pl-4 pr-4 h-[42px] mt-4 justify-between border-b-[1px] border-regaliaPurple'>
        <span className='font-bold text-[19px] text-white'>{title}</span>
        <ViewAll onClick={onClick}>View All</ViewAll>
      </div>
      <div className='flex flex-col gap-6 px-6 py-5'>
        {content.slice(0, 6).map((item) => (
          <StocksCard
            onClick={() => isStocks && push(`/stock/${item.title}`)}
            key={item.title}
            item={item}
          />
        ))}
      </div>
    </div>
  );
};
