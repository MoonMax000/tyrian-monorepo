import React from 'react';
import PercentIcon from './percent.svg';
import Input from '../../components/Input';
import Card from '../../components/Card';
import List from '../../components/List';

const config = [
    {title: "By Stocks", fieldName: 'Stock Name'},
    {title: "By Assets", fieldName: 'Asset Name'},
    {title: "By Sector", fieldName: 'Sector Name'}
]

interface PerformanceCardProps {
    title: string;
}

const PersonalItem =({title, fieldName}: {title: string; fieldName: string;}) => {
    const [itemIds, setItemIds] = React.useState([1]);

    const renderItem = ({
        id,
        fieldName,
        onChangeDynamic,
        onChangeAmount,
    }: {
        id: number;
        fieldName: string;
        onChangeDynamic: (value: string) => void;
        onChangeAmount: (value: string) => void;
    }) => (
        <div className="flex gap-4" key={id}>
            <Input className='w-[502px]' placeholder={fieldName} onChange={onChangeDynamic} />
            <Input className='w-[120px]' placeholder='Amount' endIcon={<PercentIcon width={15} height={20} />} onChange={onChangeAmount} />
        </div>
    );

    const handleChange = (id: number, name: string) => (value: string | number) => {
        console.log(`Changed ${name} of item ${id} to ${value}`);
    };

    return (
        <Card disableBorders title={title}>
            <List
                onAdd={() => setItemIds((prev) => [...prev, prev.length + 1])}
                onDelete={(id) => setItemIds((prev) => prev.length > 1 ? prev.filter((itemId) => itemId !== id) : prev)}
                items={itemIds.map((id) => ({
                    id,
                    content: renderItem({
                        id,
                        fieldName,
                        onChangeDynamic: handleChange(id, fieldName),
                        onChangeAmount: handleChange(id, "yield")
                    }),
                }))}
            />
        </Card>
    )
}

const PersonalPortfolio: React.FC<PerformanceCardProps> = ({title}) => {

    return (
        <Card hasOutline title={title} hasSwitch>
            <div className='flex flex-col gap-4'>
                {config.map(({title, fieldName}) => (
                    <PersonalItem key={fieldName} title={title} fieldName={fieldName} />
                ))}
            </div>
        </Card>
    );
};

export default PersonalPortfolio;