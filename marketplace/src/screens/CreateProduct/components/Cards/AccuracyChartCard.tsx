import React from 'react';
import Card from '../Card';
import List from '../List';
import Input from '../Input';
import UsdIcon from '@/assets/icons/usd.svg';

interface AccuracyChartCardProps {}

type ChangeFn = (value: string) => void;

const AccuracyChartCard: React.FC<AccuracyChartCardProps> = () => {
    const [itemIds, setItemIds] = React.useState([1]);

    const renderItem = ({
        id,
        onChangeMonth,
        onChangeUnprofitable,
        onChangeUprofitable,
    }: {
        id: number;
        onChangeMonth: ChangeFn;
        onChangeUnprofitable: ChangeFn;
        onChangeUprofitable: ChangeFn;
    }) => (
        <div className="flex gap-4" key={id}>
            <Input className='w-[128px]' placeholder='Month' onChange={onChangeMonth} />
            <Input className='w-[239px]' placeholder='Number of uprofitable signals' onChange={onChangeUprofitable} />
            <Input className='w-[239px]' placeholder='Number of unprofitable signals' onChange={onChangeUnprofitable} />
        </div>
    );

    const handleChange = (id: number, name: string) => (value: string | number) => {
        console.log(`Changed ${name} of item ${id} to ${value}`);
    };

    return (
        <Card title="Accuracy Chart" hasSwitch>
            <List
                onAdd={() => setItemIds((prev) => [...prev, prev.length + 1])}
                onDelete={(id) => setItemIds((prev) => prev.length > 1 ? prev.filter((itemId) => itemId !== id) : prev)}
                items={itemIds.map((id) => ({
                    id,
                    content: renderItem({
                        id,
                        onChangeMonth: handleChange(id, "month"),
                        onChangeUnprofitable: handleChange(id, "unprofitable"),
                        onChangeUprofitable: handleChange(id, "uprofitable"),
                    }),
                }))}
            />
        </Card>
    );
};

export default AccuracyChartCard;