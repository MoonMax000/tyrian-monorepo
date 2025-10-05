'use client';
import PortfolioApiCard from '@/components/ApiCards/PortfolioApiCard';
import TerminalApiCard from '@/components/ApiCards/TerminalApiCard';
import { FC } from 'react';

const ApiScreen: FC = () => {
    return (
        <div className='flex flex-col gap-[24px] mt-[24px]'>
            <TerminalApiCard />
            <PortfolioApiCard />
        </div>
    );
};

export default ApiScreen;