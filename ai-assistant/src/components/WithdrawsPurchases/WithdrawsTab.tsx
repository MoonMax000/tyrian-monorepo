import { FC } from 'react';
import { StatusIndicator, StatusType } from '../ui/StatusType/StatusType';

interface WithdrawRow {
    payout: string;
    amount: string;
    date: string;
    status: StatusType;
}

const withdraws: WithdrawRow[] = [
    {
        payout: 'Payout to Jane Doe',
        amount: '$39.99',
        date: '06.12.25',
        status: 'purple',
    },
    {
        payout: 'Payout to MetaMask',
        amount: '$14.99',
        date: '06.12.25',
        status: 'green',
    },
    {
        payout: 'Payout to Binance',
        amount: '$8.99',
        date: '06.12.25',
        status: 'green',
    },
    {
        payout: 'Payout to Jane Doe',
        amount: '$1.99',
        date: '06.12.25',
        status: 'red',
    },
    {
        payout: 'Payout to Trust Wallet',
        amount: '$9.99',
        date: '06.12.25',
        status: 'green',
    },
    {
        payout: 'Payout to Jane Doe',
        amount: '$111.99',
        date: '06.12.25',
        status: 'green',
    },
];

const statusText: Record<StatusType, string> = {
    green: 'Approved',
    purple: 'Pending',
    red: 'Declined',
};

export const WithdrawsTab: FC = () => {
    return (
        <div>
            <div className="grid grid-cols-[2.5fr_1fr_1fr_1fr] text-[12px] font-bold text-lighterAluminum py-1">
                <div>PAYOUT</div>
                <div className="text-right">AMOUNT</div>
                <div className="text-right">DATE</div>
                <div className="text-right">STATUS</div>
            </div>
            <div>
                {withdraws.map((row, i) => (
                    <div
                        key={i}
                        className={'grid grid-cols-[2.5fr_1fr_1fr_1fr] py-2 text-sm items-center'}
                    >
                        <div className="truncate text-[15px] font-[500]">{row.payout}</div>
                        <div className="text-right text-[15px] font-bold">{row.amount}</div>
                        <div className="text-right text-[15px] font-[500]">{row.date}</div>
                        <StatusIndicator
                            status={row.status}
                            className="text-right text-[15px] font-bold"
                        >
                            {statusText[row.status]}
                        </StatusIndicator>
                    </div>
                ))}
            </div>
        </div>
    );
}