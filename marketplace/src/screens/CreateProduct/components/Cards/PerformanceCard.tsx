import React from 'react';
import Card from '../Card';
import List from '../List';
import Input from '../Input';
import UsdIcon from '@/assets/icons/usd.svg';

interface PerformanceCardProps {}

const PerformanceCard: React.FC<PerformanceCardProps> = () => {
    const [itemIds, setItemIds] = React.useState([1]);

    const renderItem = (id: number, onChangeMonth: (value: string) => void, onChangeYield: (value: string) => void) => (
        <div className="flex gap-4" key={id}>
            <Input className='w-full' placeholder='Month' onChange={onChangeMonth} />
            <Input className='w-full' placeholder='Yield amount' endIcon={<UsdIcon width={9} height={16} />} onChange={onChangeYield} />
        </div>
    );

    const handleChange = (id: number, name: string) => (value: string | number) => {
        console.log(`Changed ${name} of item ${id} to ${value}`);
    };

    return (
        <Card title="Performance Chart" hasSwitch>
            <List
                onAdd={() => setItemIds((prev) => [...prev, prev.length + 1])}
                onDelete={(id) => setItemIds((prev) => prev.length > 1 ? prev.filter((itemId) => itemId !== id) : prev)}
                items={itemIds.map((id) => ({
                    id,
                    content: renderItem(
                        id,
                        handleChange(id, "month"),
                        handleChange(id, "yield")
                    ),
                }))}
            />
        </Card>
    );
};

export default PerformanceCard;