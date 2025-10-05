'use client';

import Checkbox from '@/components/ui/Checkbox/Checkbox';
import Paper from '@/components/ui/Paper/Paper';
import { FC, useState } from 'react';

const labels = [
    'When there’s an update',
];

const columns = ['Email', 'Web'];

const FavouriteProductsCard: FC = () => {
    const [checked, setChecked] = useState([
        [true, true],
    ]);

    const handleChange = (row: number, col: number, value: boolean) => {
        setChecked(prev =>
            prev.map((cbRow, rIdx) =>
                cbRow.map((cb, cIdx) =>
                    rIdx === row && cIdx === col ? value : cb
                )
            )
        );
    };

    return (
        <div className='flex flex-col gap-[24px] mt-[24px]'>
            <Paper className="p-4 rounded-[24px]">
                <div className="flex flex-col h-full">
                    <div className="font-bold text-[24px] mb-2">Products You’ve Favorited or Rated</div>
                    <div className='border-t border-regaliaPurple opacity-40 mb-2'></div>


                    <div className="grid grid-cols-[1fr,auto,auto] gap-x-[58px] mb-2 pr-[4px]">
                        <div />
                        <div className="text-right text-[12px] font-bold text-lighterAluminum pr-2">{columns[0]}</div>
                        <div className="text-right text-[12px] font-bold text-lighterAluminum">{columns[1]}</div>
                    </div>

                    <div className="flex flex-col gap-2">
                        {labels.map((label, rowIdx) => (
                            <div
                                key={label}
                                className="grid grid-cols-[1fr,auto,auto] gap-x-[58px] items-center py-2 px-1"
                            >
                                <div className="text-[15px] font-medium text-white">{label}</div>
                                {columns.map((_, colIdx) => (
                                    <div key={colIdx} className="flex justify-end pr-2 last:pr-0">
                                        <Checkbox
                                            checked={checked[rowIdx][colIdx]}
                                            onChange={val => handleChange(rowIdx, colIdx, val)}
                                        />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </Paper >
        </div >
    );
};

export default FavouriteProductsCard;