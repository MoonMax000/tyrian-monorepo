import { FC } from 'react';
import { StatusIndicator, StatusType } from '../ui/StatusType/StatusType';

interface PurchaseRow {
    product: string;
    amount: string;
    date: string;
    status: StatusType;
}

const purchases: PurchaseRow[] = [
    {
        product: 'RiskMaster - powerful tool for traders',
        amount: '$39.99',
        date: '06.12.25',
        status: 'purple',
    },
    {
        product: 'BTC/USDT Grid-Bot HODL',
        amount: '$14.99',
        date: '06.12.25',
        status: 'green',
    },
    {
        product: 'RiskMaster - powerful tool for traders',
        amount: '$8.99',
        date: '06.12.25',
        status: 'green',
    },
    {
        product: 'Momentum Breakout: Signals with ...',
        amount: '$1.99',
        date: '06.12.25',
        status: 'red',
    },
    {
        product: 'BTC/USDT Grid-Bot HODL',
        amount: '$9.99',
        date: '06.12.25',
        status: 'green',
    },
    {
        product: 'RiskMaster - powerful tool for traders',
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

export const PurchasesTab: FC = () => {
    return (
        <div>
            <div className="grid grid-cols-[2.5fr_1fr_1fr_1fr] text-[12px] font-bold text-lighterAluminum py-1">
                <div>PRODUCT</div>
                <div className="text-right">AMOUNT</div>
                <div className="text-right">DATE</div>
                <div className="text-right">STATUS</div>
            </div>
            <div>
                {purchases.map((row, i) => (
                    <div
                        key={i}
                        className={'grid grid-cols-[2.5fr_1fr_1fr_1fr] py-2 text-sm items-center'}
                    >
                        <div className="truncate text-[15px] font-[500]">{row.product}</div>
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