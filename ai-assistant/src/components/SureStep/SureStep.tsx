'use client';
import { FC } from 'react';
import Button from '../ui/Button/Button';

interface Props {
    title?: string;
    description?: React.ReactNode;
    onSubmit: () => void;
    onClose: () => void;
}

export const SureStep: FC<Props> = ({ title, description, onSubmit, onClose }) => {
    return (
        <div className='flex flex-col text-center justify-between h-full '>
            <div className='flex flex-col'>
                {title && <h2 className='flex flex-start text-2xl font-semibold mb-2'>{title}</h2>}
                {description && (
                    <div className='text-[15px] font-normal text-left text-lighterAluminum mb-6'>
                        {description}
                    </div>
                )}
            </div>
            <div className='flex justify-between gap-[16px]'>
                <Button
                    ghost={true}
                    type='button'
                    onClick={() => onClose()}
                    className='w-[162.5px] h-[44px] backdrop-blur-[100px] py-[10px] px-[24px] text-lighterAluminum'>
                    Cancel
                </Button>
                <Button
                    type='button'
                    onClick={() => onSubmit()}
                    className='w-[162.5px] h-[44px] p-[10px] bg-red'>
                    Delete
                </Button>
            </div>
        </div>
    );
};