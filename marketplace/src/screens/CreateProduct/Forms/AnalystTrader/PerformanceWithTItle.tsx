import React from 'react';
import UsdIcon from '@/assets/icons/usd.svg';
import Input from '../../components/Input';
import Card from '../../components/Card';
import List from '../../components/List';

interface PerformanceCardProps {
    title: string;
}

const PerformanceWithTitle: React.FC<PerformanceCardProps> = ({title}) => {
    const [itemIds, setItemIds] = React.useState([1]);

    const renderItem = (id: number, onChangeYear: (value: string) => void, onChangeYield: (value: string) => void) => (
        <div className="flex gap-4" key={id}>
            <Input className='w-full' placeholder='Year' onChange={onChangeYear} />
            <Input className='w-full' placeholder='Yield amount' endIcon={<UsdIcon width={9} height={16} />} onChange={onChangeYield} />
        </div>
    );

    const handleChange = (id: number, name: string) => (value: string | number) => {
        console.log(`Changed ${name} of item ${id} to ${value}`);
    };

    return (
        <Card title={title} hasSwitch>
            <List
                onAdd={() => setItemIds((prev) => [...prev, prev.length + 1])}
                onDelete={(id) => setItemIds((prev) => prev.length > 1 ? prev.filter((itemId) => itemId !== id) : prev)}
                items={itemIds.map((id) => ({
                    id,
                    content: renderItem(
                        id,
                        handleChange(id, "year"),
                        handleChange(id, "yield")
                    ),
                }))}
            />
        </Card>
    );
};

export default PerformanceWithTitle;