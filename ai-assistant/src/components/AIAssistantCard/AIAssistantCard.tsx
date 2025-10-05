import Paper from '../ui/Paper/Paper';
import { FC, ReactNode } from 'react';
import Button from '../ui/Button/Button';
import AIAssistant from '@/assets/Navbar/AIAssistant.svg';
import { IndicatorTag } from '../ui/IndicatorTag/IndicatorTag';

interface AIAssistantCardProps {
    children?: ReactNode;
}

const AIAssistantCard: FC<AIAssistantCardProps> = ({ children }) => {
    return (
        <Paper className={'p-4 rounded-[24px]'}>
            <div className='flex flex-col h-full'>
                <div className='flex-1 flex flex-col justify-start overflow-hidden'>
                    <div className='flex justify-between'>
                        <div className='text-white font-bold text-[24px]'>AI Assistant</div>
                        <IndicatorTag type='purple' className='flex items-center text-[12px] font-bold py-[2px] px-[4px]'>New Tip</IndicatorTag>
                    </div>
                    <div className='border-t border-regaliaPurple opacity-40 my-2'></div>
                </div>
                <div className='flex flex-col justify-start gap-[4px] mb-[16px]'>
                    <div className='text-[19px] font-bold'>Monitor SOL support at $120</div>
                    <div className='text-[15px] font-bold text-lighterAluminum'>Technical analysis suggests a potential rebound</div>
                </div>
                <div className='flex flex-col gap-[8px] mb-[16px]'>
                    <Paper className='flex flex-col justify-start rounded-[8px] border border-gunpowder px-[16px] py-[6px] gap-[8px]'>
                        <div className='flex justify-between'>
                            <div className='text-[12px] font-bold'>BTC/USD long</div>
                            <IndicatorTag type='darckGreen' className='flex items-center text-[12px] font-bold py-[2px] px-[4px] text-[12px] font-bold'>+12.4%</IndicatorTag>
                        </div>
                        <div className='flex justify-between'>
                            <div className='text-[12px] font-bold text-lighterAluminum'>Entry: $45,230</div>
                            <div className='text-[12px] font-bold text-lighterAluminum'>2h ago</div>
                        </div>
                    </Paper>
                    <Paper className='flex flex-col justify-start rounded-[8px] border border-gunpowder px-[16px] py-[6px] gap-[8px]'>
                        <div className='flex justify-between'>
                            <div className='text-[12px] font-bold'>ETH/USD Short</div>
                            <IndicatorTag type='red' className='flex items-center text-[12px] font-bold py-[2px] px-[4px] text-[12px] font-bold'>-3.2%</IndicatorTag>
                        </div>
                        <div className='flex justify-between'>
                            <div className='text-[12px] font-bold text-lighterAluminum'>Entry: $3,120</div>
                            <div className='text-[12px] font-bold text-lighterAluminum'>5h ago</div>
                        </div>
                    </Paper>
                </div>
                <Button className='text-white text-[15px] font-bold gap-[4px] px-[16px]'> <AIAssistant className='w-[20px] h-[20px]' /> Open AI Assistant</Button>
            </div>
            {children}
        </Paper>
    );
};

export default AIAssistantCard;