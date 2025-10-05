'use client';

import Checkbox from '@/components/ui/Checkbox/Checkbox';
import Paper from '@/components/ui/Paper/Paper';
import { FC, useState } from 'react';

type OpinionType = {
    label: string;
    email?: boolean;
    web?: boolean;
};

const options: OpinionType[] = [
    { label: 'When someone mentions you in an opinion', email: true, web: true },
    { label: 'When someone mentions you in a comment on an opinion', web: true },
];

const columns = ['Email', 'Web'];

const OpinionsCard: FC = () => {
    const [checked, setChecked] = useState<OpinionType[]>(options);

    const handleChange = (rowIdx: number, field: 'email' | 'web', value: boolean) => {
        setChecked(prev =>
            prev.map((item, idx) =>
                idx === rowIdx ? { ...item, [field]: value } : item
            )
        );
    };

    return (
        <div className="flex flex-col gap-[24px] mt-[24px]">
            <Paper className="p-4 rounded-[24px]">
                <div className="flex flex-col h-full">
                    <div className="font-bold text-[24px] mb-2">Opinions</div>
                    <div className='border-t border-regaliaPurple opacity-40 mb-2'></div>

                    <div className="grid grid-cols-[1fr,auto,auto] gap-x-[58px] mb-2 pr-[4px]">
                        <div />
                        <div className="text-right text-[12px] font-bold text-lighterAluminum pr-2">{columns[0]}</div>
                        <div className="text-right text-[12px] font-bold text-lighterAluminum">{columns[1]}</div>
                    </div>

                    <div className="flex flex-col gap-2">
                        {checked.map((option, rowIdx) => (
                            <div
                                key={option.label}
                                className="grid grid-cols-[1fr,auto,auto] gap-x-[58px] items-center py-2 px-1"
                            >
                                <div className="text-[15px] font-bold">{option.label}</div>

                                <div className="flex justify-end pr-2">
                                    {'email' in option ? (
                                        <Checkbox
                                            checked={!!option.email}
                                            onChange={val => handleChange(rowIdx, 'email', val)}
                                        />
                                    ) : (
                                        <div className="w-6 h-6" />
                                    )}
                                </div>

                                <div className="flex justify-end">
                                    {'web' in option ? (
                                        <Checkbox
                                            checked={!!option.web}
                                            onChange={val => handleChange(rowIdx, 'web', val)}
                                        />
                                    ) : (
                                        <div className="w-6 h-6" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Paper>
        </div>
    );
};

export default OpinionsCard;