import Paper from '../ui/Paper/Paper';
import { FC, ReactNode } from 'react';
import PortfolioDiagram from '@/assets/mock-avatars/PortfolioDiagram.svg';
import Button from '../ui/Button/Button';
import ArrowButton from '@/assets/Navbar/ArrowButton.svg';
import { IndicatorTag } from '../ui/IndicatorTag/IndicatorTag';

interface RevenueCardProps {
    children?: ReactNode;
}

const RevenueCard: FC<RevenueCardProps> = ({ children }) => {
    return (
        <Paper className={'p-4 rounded-[24px]'}>
            <div className='flex flex-col h-full'>
                <div className='relative flex-1 flex flex-col justify-start overflow-hidden'>
                    <div className='z-10 pb-[8px]'>
                        <div className='flex justify-between'>
                            <div className='text-white font-bold text-[24px]'>My Revenue</div>
                            <IndicatorTag type='darckGreen' className='flex items-center text-[12px] font-bold py-[1px] px-[4px]'>Growing</IndicatorTag>
                        </div>
                        <div className='border-t border-regaliaPurple opacity-40 my-2'></div>
                        <div className='text-[12px] font-bold text-lighterAluminum'>VALUE</div>
                        <div className='text-white text-[31px] font-bold'>$72,450.00</div>
                    </div>
                    <div className='absolute inset-0 flex items-end z-0'>
                        <PortfolioDiagram className='w-full h-[150px]' />
                    </div>
                </div>
                <div className='relative z-10 flex justify-start pb-1 pt-2 gap-[16px]'>
                    <div>
                        <div className='text-[12px] font-bold text-lighterAluminum'>TODAY CHANGE</div>
                        <div className='text-green text-[15px] font-bold'>+2.4%</div>
                    </div>
                    <div>
                        <div className='text-[12px] font-bold text-lighterAluminum text-right'>ALL TIME</div>
                        <div className='text-green text-[15px] font-bold text-right'>+15.7%</div>
                    </div>
                </div>
                <Button className='text-white text-[15px] font-bold gap-[4px] px-[16px]'> <ArrowButton className='w-[20px] h-[20px] rotate-[270deg]' /> View Portfolio</Button>
            </div>
            {children}
        </Paper>
    );
};

export default RevenueCard;