'use client';
import Paper from '@/components/ui/Paper/Paper';
import { FC } from 'react';
import { IndicatorTag } from '../ui/IndicatorTag/IndicatorTag';
import Button from '../ui/Button/Button';
import ChangeIcon from '@/assets/system-icons/changePlanIcon.svg';
import CancelIcon from '@/assets/system-icons/cancelIcon.svg';

const CurrrentPlanCard: FC = () => {
    return (
        <Paper className='flex flex-col p-4 mt-[24px] rounded-[24px]'>
            <div className='relative flex-1 flex flex-col justify-start overflow-hidden'>
                <div className='flex justify-between'>
                    <div className='text-white font-bold text-[24px]'>Current Plan</div>
                    <IndicatorTag type='darckGreen' className='flex items-center text-[12px] font-bold py-[2px] px-[4px]'>Active</IndicatorTag>
                </div>
                <div className='border-t border-regaliaPurple opacity-40 my-2'></div>
            </div>
            <Paper className='flex flex-col gap-[4px] p-4 my-[24px] rounded-[8px] border border-gunpowder'>
                <div className='flex justify-between'>
                    <div className='text-[19px] font-bold'>Premium</div>
                    <div className='flex justify-between gap-[4px] items-center'>
                        <div className='text-[19px] font-bold'>$19.99</div>
                        <div className='text-[15px] font-[500] text-lighterAluminum'>/ month</div>
                    </div>
                </div>
                <div className='flex flex-start text-[15px] font-[500] text-lighterAluminum'>Next billing date: July 15, 2025</div>
            </Paper>
             <div className='flex justify-end gap-[16px]'>
            <Button className='w-[180px] h-[40px] py-[10px] px-[16px] gap-[4px]'><ChangeIcon className='w-[20px] h-[20px] text-white' /> Change Plan</Button>
            <Button ghost={true} className='backdrop-blur-[100px] h-[40px] py-[10px] px-[12px] gap-[4px] text-red border border-red'>
                <CancelIcon className='w-[20px] h-[20px]' />Cancel Subscription
            </Button>
        </div>
        </Paper >
    );
};

export default CurrrentPlanCard;