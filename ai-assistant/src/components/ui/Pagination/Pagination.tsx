'use client';

import { useMemo } from 'react';
import { getPages } from '@/utilts/getPages';
import { cn } from '@/utilts/cn';
import DoublePrev from '@/assets/Pagination/DoublePrev.svg';
import DoubleNext from '@/assets/Pagination/DoubleNext.svg';
import Next from '@/assets/Pagination/Next.svg';
import Prev from '@/assets/Pagination/Prev.svg';


interface IProps {
    totalPages: number | undefined;
    currentPage: number | undefined;
    onChange: (val: number) => void;
}

const Pagination: React.FC<IProps> = ({ totalPages, currentPage, onChange }) => {
    const pages = useMemo(() => {
        return getPages(currentPage || 1, 5, totalPages || 1);
    }, [currentPage, totalPages]);

    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages;

    if (!totalPages || !currentPage || totalPages <= 1) return <></>;

    return (
        <nav className='flex items-center justify-center gap-[4px] mt-4'>
            <div className="rounded-[4px] bg-gradient-to-r from-[#482090] to-[#A06AFF] p-[1px]">
                <button
                    className={cn(
                        'flex items-center justify-center w-[44px] h-[44px] rounded-[4px] bg-[#181B20] text-[#B0B0B0] transition hover:bg-[#482090]',
                        {
                            'cursor-not-allowed opacity-50': isFirstPage,
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

            <div className="rounded-[4px] bg-gradient-to-r from-[#482090] to-[#A06AFF] p-[1px]">
                <button
                    className={cn(
                        'flex items-center justify-center w-[44px] h-[44px] rounded-[4px] bg-[#181B20] text-[#B0B0B0] transition hover:bg-[#482090]',
                        {
                            'cursor-not-allowed opacity-50': isFirstPage,
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
                    className="w-[46px] h-[46px] rounded-[4px] px-[1px] py-[1px] bg-gradient-to-r from-[#482090] to-[#A06AFF]">
                    <button
                        key={item}
                        className={cn(
                            'rounded w-full h-full bg-[#181B20] transition',
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

            <div className="rounded-[4px] bg-gradient-to-r from-[#482090] to-[#A06AFF] p-[1px]">
                <button
                    className={cn(
                        'flex items-center justify-center w-[44px] h-[44px] rounded-[4px] bg-[#181B20] text-[#B0B0B0] transition hover:bg-[#482090]',
                        {
                            'cursor-not-allowed opacity-50': isLastPage,
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

            <div className="rounded-[4px] bg-gradient-to-r from-[#482090] to-[#A06AFF] p-[1px]">
                <button
                    className={cn(
                        'flex items-center justify-center w-[44px] h-[44px] rounded-[4px] bg-[#181B20] text-[#B0B0B0] transition hover:bg-[#482090]',
                        {
                            'cursor-not-allowed opacity-50': isLastPage,
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
