'use client';
import Paper from '@/components/ui/Paper/Paper';
import Button from '../ui/Button/Button';
import Checkbox from '../ui/Checkbox/Checkbox';
import React, { useState } from 'react';
import PaymentMethodIcon from '@/assets/system-icons/PaymentMethodIcon.svg'

type PaymentRow = {
    method: string;
    icon: React.ReactNode;
    details: string;
    expiry: string;
    isDefault: boolean;
};

const initialMethods: PaymentRow[] = [
    {
        method: 'Visa',
        icon: <PaymentMethodIcon />,
        details: '**** **** **** 4242',
        expiry: '09/26',
        isDefault: true,
    },
    {
        method: 'Mastercard',
        icon: <PaymentMethodIcon />,
        details: '**** **** **** 5555',
        expiry: '07/34',
        isDefault: false,
    },
];

const PaymentMethodsCard: React.FC = () => {
    const [methods, setMethods] = useState(initialMethods);

    const setDefault = (idx: number) => {
        setMethods((rows) =>
            rows.map((row, i) => ({
                ...row,
                isDefault: i === idx,
            }))
        );
    };

    return (
        <Paper className='flex flex-col p-4 rounded-[24px]'>
            <div className='flex flex-col'>
                <div className='flex justify-between items-center'>
                    <div className='font-bold text-[24px]'>Payment Methods</div>
                </div>
                <div className='border-t border-regaliaPurple opacity-40 my-4'></div>
            </div>

            <div className='grid grid-cols-[1.4fr_1.5fr_0.6fr_1.6fr_1fr] text-[12px] font-bold text-lighterAluminum uppercase mb-[16px] mt-[8px]'>
                <div>Method</div>
                <div>Details</div>
                <div>Expiry</div>
                <div className='text-center'>Default</div>
                <div className='text-right'>Action</div>
            </div>

            <div>
                {methods.map((row, i) => (
                    <div
                        key={i}
                        className={'grid grid-cols-[1.4fr_1.5fr_0.6fr_1.6fr_1fr] items-center py-[12px]'}
                    >
                        <div className='flex items-center text-[15px] gap-[4px]'>
                            {row.icon}
                            {row.method}
                        </div>

                        <div className='text-[15px] font-bold '>
                            {row.details.slice(0, -4)}
                            <span className='font-bold'>{row.details.slice(-4)}</span>
                        </div>
                        <div className='text-[15px] font-[500]'>{row.expiry}</div>

                        <div className='flex justify-center'>
                            <Checkbox
                                checked={row.isDefault}
                                onChange={() => setDefault(i)}
                            />
                        </div>

                        <div className='flex items-center gap-4 justify-end'>
                            <button className='text-lightPurple font-bold hover:underline transition'>Edit</button>
                            <div className='w-px h-4 bg-gunpowder' />
                            <button className='text-red font-bold hover:underline transition'>Remove</button>
                        </div>
                    </div>
                ))}
            </div>

            <div className='flex justify-end mt-6'>
                <Button className='w-[180px] h-[40px] p-[10px] text-[15px] font-bold'>
                    Add Payment Method
                </Button>
            </div>
        </Paper>
    );
};

export default PaymentMethodsCard;