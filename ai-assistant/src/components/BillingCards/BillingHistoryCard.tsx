'use client';
import Paper from '@/components/ui/Paper/Paper';
import InvoiceIcon from '@/assets/system-icons/invoiceIcon.svg';
import { FC } from 'react';
import { StatusIndicator, StatusType } from '../ui/StatusType/StatusType';

type BillingRow = {
    date: string;
    description: string;
    amount: string;
    status: StatusType;
};

const billingRows: BillingRow[] = [
    {
        date: '15.06.25',
        description: 'Premium Plan - Monthly',
        amount: '$19.99',
        status: 'green',
    },
    {
        date: '15.05.25',
        description: 'Premium Plan - Monthly',
        amount: '$19.99',
        status: 'green',
    },
    {
        date: '15.04.25',
        description: 'Premium Plan - Monthly',
        amount: '$19.99',
        status: 'green',
    },
];

const statusText: Record<StatusType, string> = {
    green: 'Paid',
    purple: 'Pending',
    red: 'Declined',
};

const BillingHistoryCard: FC = () => {
    return (
        <Paper className='flex flex-col p-4 rounded-[24px]'>
            <div className='flex flex-col'>
                <div className='flex justify-between items-center'>
                    <div className='font-bold text-[24px]'>Billing History</div>
                </div>
                <div className='border-t border-regaliaPurple opacity-40 my-4'></div>
            </div>

            <div className='grid grid-cols-[1.5fr_1.5fr_1fr_1.5fr_0.5fr] text-left text-lighterAluminum text-[12px] font-bold uppercase mb-[16px]'>
                <div>DATE</div>
                <div>DESCRIPTION</div>
                <div>AMOUNT</div>
                <div>STATUS</div>
                <div className='text-right'>INVOICE</div>
            </div>

            <div>
                {billingRows.map((row, idx) => (
                    <div
                        key={idx}
                        className='grid grid-cols-[1.5fr_1.5fr_1fr_1.5fr_0.5fr] items-center text-[15px] mb-[16px]'
                    >
                        <div className='text-[15px] font-[500]'>{row.date}</div>
                        <div className='text-[15px] font-bold'>{row.description}</div>
                        <div className='text-[15px] font-[500]'>{row.amount}</div>
                        <div className='flex justify-start ml-[4px]'>
                            <StatusIndicator
                                status={row.status}
                                className="text-right bg-darkGreen rounded-[4px] px-[4px] py-[2px] text-[15px] font-bold"
                            >
                                {statusText[row.status]}
                            </StatusIndicator>
                        </div>
                        <div className='flex justify-end mr-[12px]'>
                            <InvoiceIcon className='w-5 h-5 text-lighterAluminum' />
                        </div>
                    </div>
                ))}
            </div>
        </Paper>
    );
};

export default BillingHistoryCard;
