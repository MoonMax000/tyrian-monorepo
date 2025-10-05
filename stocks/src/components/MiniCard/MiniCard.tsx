import SpdrIcon from '@/assets/icons/spdr.svg';
import { PercentCard } from '../PercentCard/PercentCard';

export const MiniCard = () => {
  return (
    <div
      key={Math.random()}
      className='flex flex-col w-[242.333px] h-[136px] rounded-[24px] border border-regaliaPurple p-4 gap-[10px] backdrop-blur-[100px]'
      style={{
        background: 'rgba(12, 16, 20, 0.5)',
      }}
    >
      <div className='flex flex-col h-full  justify-between'>
        <div className='flex gap-2'>
          <SpdrIcon />
          <div className='flex flex-col'>
            <span className='text-[15px] font-bold'>SPDR</span>
            <span className='text-[15px] font-bold'>S$P 500 ETF</span>
          </div>
        </div>
        <div className='flex justify-between'>
          <span className='text-[19px] font-bold'>$452.12</span>
          <span>
            <PercentCard className='bg-darkRed' classNameText='text-red' />
          </span>
        </div>
      </div>
    </div>
  );
};
