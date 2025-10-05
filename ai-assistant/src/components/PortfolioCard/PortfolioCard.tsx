import Paper from '../ui/Paper/Paper';
import { FC, ReactNode } from 'react';
import PortfolioDiagram from '@/assets/mock-avatars/PortfolioDiagram.svg';

interface PortfolioCardProps {
  children?: ReactNode;
}

const PortfolioCard: FC<PortfolioCardProps> = ({ children }) => {
  return (
    <Paper className={'w-full h-[309px] p-4'}>
      <div className='flex flex-col h-full'>
        <div className='relative flex-1 flex flex-col justify-start overflow-hidden'>
          <div className='z-10 pb-1'>
            <div className='text-white font-bold text-[24px]'>Jane’s Portfolio</div>
            <div className='border-t border-regaliaPurple opacity-40 my-2'></div>
            <div className='text-white text-[31px] font-bold'>$218,560.00</div>
          </div>
          <div className='absolute inset-0 flex items-end z-0 pointer-events-none'>
            <PortfolioDiagram className='w-full h-[160px]' />
          </div>
        </div>
        <div className='relative z-10 flex justify-between px-6 pb-1 pt-2'>
          <div>
            <div className='text-sm text-lighterAluminum'>YTD</div>
            <div className='text-green text-[24px] font-bold'>+15.2%</div>
          </div>
          <div>
            <div className='text-sm text-lighterAluminum text-right'>BEST TRADE EVER</div>
            <div className='text-green text-[24px] font-bold text-right'>+8.40%</div>
          </div>
        </div>
      </div>
      {children}
    </Paper>
  );
};

export default PortfolioCard;
