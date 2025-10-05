'use client';

import { useMemo } from 'react';
import { getPages } from './utils';
import { cn } from '@/utilts/cn';
import DoublePrev from '@/assets/icons/pagination/DoublePrev.svg';
import DoubleNext from '@/assets/icons/pagination/DoubleNext.svg';
import Next from '@/assets/icons/pagination/Next.svg';
import Prev from '@/assets/icons/pagination/Prev.svg';


interface IProps {
    totalPages: number | undefined;
    currentPage: number | undefined;
    onChange: (val: number) => void;
}

const Pagination: React.FC<IProps> = ({ totalPages, currentPage, onChange }) => {
    const pages = useMemo(() => {
        return getPages(currentPage || 1, 3, totalPages || 1);
    }, [currentPage, totalPages]);

    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages;

    if (!totalPages || !currentPage || totalPages <= 1) return <></>;

    return (
        <nav className='flex items-center justify-center gap-[4px] mt-4'>
            <div className="rounded-[4px] bg-gunpowder p-[1px]">
                <button
                    className={cn(
                        'flex items-center justify-center w-[44px] h-[44px] rounded-[4px] custom-bg-blur text-[#B0B0B0] transition hover:bg-[#482090]',
                        {
                            'cursor-pointer hover:bg-[#2a2e38]': !isFirstPage,
                        },
                    )}
                    onClick={() => !isFirstPage && onChange(1)}
                    disabled={isFirstPage}
                    aria-label='Go to first page'
                >
                    <DoublePrev />
                </button>
            </div>

            <div className="rounded-[4px] bg-gunpowder p-[1px]">
                <button
                    className={cn(
                        'flex items-center justify-center w-[44px] h-[44px] rounded-[4px] custom-bg-blur text-[#B0B0B0] transition hover:bg-[#482090]',
                        {
                            'cursor-pointer hover:bg-[#2a2e38]': !isFirstPage,
                        },
                    )}
                    onClick={() => !isFirstPage && onChange(currentPage - 1)}
                    disabled={isFirstPage}
                    aria-label='Go to previous page'
                >
                    <Prev />
                </button>
            </div>

            {pages.map((item, idx) => (
                <div
                    key={typeof item === 'number' ? item : `ellipsis-${idx}`}
                    className="w-[46px] h-[46px] rounded-[4px] px-[1px] py-[1px] bg-gunpowder">
                    <button
                        key={item}
                        className={cn(
                            'rounded w-full h-full custom-bg-blur transition',
                            {
                                'bg-gradient-to-r from-[#482090] to-[#A06AFF] text-white': item === currentPage,
                                'text-[#B0B0B0] hover:bg-[#482090] cursor-pointer': item !== currentPage,
                            },
                        )}
                        onClick={() => onChange(item)}
                        aria-label={`Go to page ${item}`}
                    >
                        {item}
                    </button>
                </div>
            ))}

            <div className="rounded-[4px] p-[1px] bg-gunpowder">
                <button
                    className={cn(
                        'flex items-center justify-center w-[44px] h-[44px] rounded-[4px] custom-bg-blur text-[#B0B0B0] transition hover:bg-[#482090]',
                        {
                            'cursor-pointer hover:bg-[#2a2e38]': !isLastPage,
                        },
                    )}
                    onClick={() => !isLastPage && onChange(currentPage + 1)}
                    disabled={isLastPage}
                    aria-label='Go to next page'
                >
                    <Next />
                </button>
            </div>

            <div className="rounded-[4px] p-[1px] bg-gunpowder">
                <button
                    className={cn(
                        'flex items-center justify-center w-[44px] h-[44px] rounded-[4px] custom-bg-blur text-[#B0B0B0] transition hover:bg-[#482090]',
                        {
                            'cursor-pointer hover:bg-[#2a2e38]': !isLastPage,
                        },
                    )}
                    onClick={() => !isLastPage && onChange(totalPages)}
                    disabled={isLastPage}
                    aria-label='Go to last page'
                >
                    <DoubleNext />
                </button>
            </div>
        </nav>
    );
};

export default Pagination;
