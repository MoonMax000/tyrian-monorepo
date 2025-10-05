import Paper from '../ui/Paper/Paper';
import { FC, ReactNode } from 'react';
import Button from '../ui/Button/Button';
import JoinStream from '@/assets/Dashboard/JoinStream.svg';
import { IndicatorTag } from '../ui/IndicatorTag/IndicatorTag';

interface LiveStreamingCardProps {
    children?: ReactNode;
}

const LiveStreamingCard: FC<LiveStreamingCardProps> = ({ children }) => {
    return (
        <Paper className={'p-4 rounded-[24px]'}>
            <div className='flex flex-col h-full'>
                <div className='relative flex-1 flex flex-col justify-start overflow-hidden'>
                    <div className='flex justify-between'>
                        <div className='text-white font-bold text-[24px]'>Live Streaming</div>
                        <IndicatorTag type='orange' className='flex items-center text-[12px] font-bold py-[2px] px-[4px]'>Soon</IndicatorTag>
                    </div>
                    <div className='border-t border-regaliaPurple opacity-40 my-2'></div>
                </div>
                <div className=' grid grid-cols-2 gap-[20px] pb-1 pt-2 mb-[24px]'>
                    <div className='flex flex-col items-start gap-[8px]'>
                        <div className='text-[12px] font-bold text-lighterAluminum'>STREAM IN</div>
                        <div className='text-[15px] font-bold'>2 Hours</div>
                    </div>
                    <div className='flex flex-col items-start gap-[8px]'>
                        <div className='text-[12px] font-bold text-lighterAluminum text-right'>CHANNEL</div>
                        <div className='text-[15px] font-bold text-right'>beautydoe</div>
                    </div>
                </div>
                <div className='flex flex-col items-start mb-[16px] gap-[8px]'>
                    <div className='text-[12px] font-bold text-lighterAluminum text-right'>TOPIC</div>
                    <div className='text-[15px] font-bold'>Investing in a new Solana solutions for the market</div>
                </div>
                <div className='flex flex-col items-start mb-[16px]'>
                    <div className='text-[12px] font-bold text-lighterAluminum text-right'>START</div>
                    <div className='text-[15px] font-bold text-right'>12:30 MSK</div>
                </div>
                <Button className='text-white text-[15px] font-bold gap-[4px] px-[16px]'> <JoinStream className='w-[20px] h-[20px]' /> Join Stream</Button>
            </div>
            {children}
        </Paper>
    );
};

export default LiveStreamingCard;