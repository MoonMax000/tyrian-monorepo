'use client';
import Checkbox from '@/components/ui/Checkbox/Checkbox';
import Paper from '@/components/ui/Paper/Paper';
import { FC, useState } from 'react';

const labels = [
    'Enable notification sound',
    'Show desktop notifications',
    'Emails about suspicious login attempts to your account',
];

const NotificationsCard: FC = () => {
    const [checked, setChecked] = useState([true, true, true]);

    const handleChange = (index: number, value: boolean) => {
        setChecked(prev =>
            prev.map((item, i) => (i === index ? value : item))
        );
    };

    return (
        <div className='flex flex-col gap-[24px] mt-[24px]'>
            <Paper className={'p-4 rounded-[24px] gap-[24px]'}>
                <div className='flex flex-col h-full'>
                    <div className='flex-1 flex flex-col justify-start overflow-hidden'>
                        <div className='flex justify-between'>
                            <div className='font-bold text-[24px]'>Notifications</div>
                        </div>
                        <div className='border-t border-regaliaPurple opacity-40 my-2'></div>
                        <div className='flex flex-col gap-[24px] mt-[24px] mb-[16px]'>
                            {labels.map((label, idx) => (
                                <div key={label} className='flex justify-between items-center'>
                                    <div className='text-[15px] font-bold'>{label}</div>
                                    <Checkbox
                                        checked={checked[idx]}
                                        onChange={value => handleChange(idx, value)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Paper>
        </div>
    );
};

export default NotificationsCard;