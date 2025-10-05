import React from 'react';
import BaseSelector from '../../components/Selector/Base';
import List from '../../components/List';
import UsdIcon from '@/assets/icons/usd.svg';
import Input from '../../components/Input';

interface PriceListProps {
  className?: string;
}

const options = [
  "Per month",
  "One time",
];

interface RenderItemProps {
    id: number;
    onChangeServiceName: (value: string) => void;
    onChangeAmount: (value: string) => void;
    onChangeFrequency: (value: string) => void;
}

export const PriceList: React.FC<PriceListProps> = ({ className = '' }) => {
     const [itemIds, setItemIds] = React.useState([1]);

    const renderItem = ({ id, onChangeServiceName, onChangeAmount, onChangeFrequency }: RenderItemProps) => (
        <div className="flex gap-4" key={id}>
            <Input className='w-[332px]' placeholder='Service Name' onChange={onChangeServiceName} />
            <Input className='w-[137px]' placeholder='Amount' endIcon={<UsdIcon width={9} height={16} />} onChange={onChangeAmount} />
            <BaseSelector className='w-[137px]' defaultValue={options[0]} options={options} onSelect={onChangeFrequency} />
        </div>
    );

    const handleChange = (id: number, name: string) => (value: string | number) => {
        console.log(`Changed ${name} of item ${id} to ${value}`);
    };

  return (
    <div className={`w-full ${className}`}>
      <div className='font-semibold text-[19px] leading-[26px] mb-2'>
        Price List
      </div>
      <div className='flex gap-2'>
          <List
            className='w-full !gap-2'
            buttonTitle='Add Service'
            onAdd={() => setItemIds((prev) => [...prev, prev.length + 1])}
            onDelete={(id) => setItemIds((prev) => prev.length > 1 ? prev.filter((itemId) => itemId !== id) : prev)}
            items={itemIds.map((id) => ({
                id,
                content: renderItem({
                    id,
                    onChangeServiceName: handleChange(id, "serviceName"),
                    onChangeAmount: handleChange(id, "amount"),
                    onChangeFrequency: handleChange(id, "frequency")
                }),
            }))} />
      </div>
    </div>
  );
};