import React from 'react';
import Input from '../Input';
import Card from '../Card';

interface SpecificationItem {
    name: string;
    placeholder: string;
}

interface SpecificationsProps {
    items: SpecificationItem[];
    onChange?: (name: string, value: string) => void;
}

const SpecificationsCard: React.FC<SpecificationsProps> = ({ items, onChange }) => {
    return (
        <Card title='Specifications' hasOutline>
            <div className='flex flex-col gap-4'>
                {items.map((item) => (
                    <Input
                        key={item.name}
                        placeholder={item.placeholder}
                        headIcon={(
                            <div className='p-[6px]'>
                                <div className="w-1 h-1 bg-primary rounded-full" />
                            </div>
                        )}
                        onChange={(value: string) => onChange?.(item.name, value)}
                    />
                ))}
            </div>
        </Card>
    );
};

export default SpecificationsCard;
