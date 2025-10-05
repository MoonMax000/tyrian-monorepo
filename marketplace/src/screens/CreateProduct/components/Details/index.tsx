import Button from '@/components/UI/Button/Button';
import React from 'react';
import Input from '../Input';

const Details: React.FC = () => {
    const [selected, setSelected] = React.useState<string | null>("Cryptocurrencies");

    const handleButtonClick = (buttonName: string) => () => {
        setSelected(buttonName);
    };

    const getButtonVariant = (buttonName: string) => {
        return selected === buttonName ? "primary" : "secondary";
    };

    return (
        <div className='p-4 flex flex-col gap-4 rounded-2xl custom-bg-blur border border-regaliaPurple'>
            <span className="font-semibold text-[24px] leading-[33px] tracking-[0]">
                Details
            </span>

            <div className='flex gap-2'>
                {['Cryptocurrencies', 'Stocks and Stock Markets'].map((item) => (
                    <Button className='font-semibold h-[26px] w-full' key={item} variant={getButtonVariant(item)} onClick={handleButtonClick(item)}>
                        {item}
                    </Button>
                ))}
            </div>

            <Input label="CRYPTOCURRENCIES" placeholder="Bitcoin, Ethereum, etc..." />
            <Input label="PAIR" placeholder="BTC/USDT" />
            <Input label="MAX DRAWDOWN" placeholder="8.2%" />
            <Input label="MARKET TYPE" placeholder="Futures" />
            <Input label="TYPE" placeholder="Stocks, Futures, etc..." />
            <Input label="STRATEGY" placeholder="Tech Analysis (MA, RSI)" />
            <Input label="SETTINGS" placeholder="Custom Indications" />
        </div>
    );
};

export default Details;