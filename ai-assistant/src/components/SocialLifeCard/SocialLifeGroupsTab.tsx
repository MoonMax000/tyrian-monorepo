import { FC } from 'react';
import Paper from '../ui/Paper/Paper';

export const SocialLifeGroupsTab: FC = () => {
    return (
        <div className='flex flex-col gap-[10px]'>
            <div className='flex flex-col gap-[8px] mb-[8px]'>
                <div className='grid grid-cols-2 gap-[10px]'>
                    <Paper className='h-[116px] w-full rounded-[16px] border border-gunpowder p-4 flex flex-col justify-start gap-[16px]'>
                        <div className='text-[12px] font-bold text-lighterAluminum'>TOTAL<br />REVENUE</div>
                        <div className='text-[24px] font-bold'>$0</div>
                    </Paper>
                    <Paper className='h-[116px] w-full rounded-[16px] border border-gunpowder p-4 flex flex-col justify-start gap-[16px]'>
                        <div className='text-[12px] font-bold text-lighterAluminum'>ACTIVE<br />SUBS</div>
                        <div className='text-[24px] font-bold'>0</div>
                    </Paper>
                </div>
                <div className='grid grid-cols-2 gap-[10px]'>
                    <Paper className='h-[116px] w-full rounded-[16px] border border-gunpowder p-4 flex flex-col justify-start gap-[16px]'>
                        <div className='text-[12px] font-bold text-lighterAluminum'>TODAY’S<br />NEW SUBS</div>
                        <div className='text-[24px] font-bold'>0</div>
                    </Paper>
                    <Paper className='h-[116px] w-full rounded-[16px] border border-gunpowder p-4 flex flex-col justify-start gap-[16px]'>
                        <div className='text-[12px] font-bold text-lighterAluminum'>AVERAGE<br />RATING</div>
                        <div className='text-[24px] font-bold'>0.0</div>
                    </Paper>
                </div>
            </div>
        </div>
    )
}