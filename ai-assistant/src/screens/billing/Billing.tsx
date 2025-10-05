'use client';
import BillingHistoryCard from '@/components/BillingCards/BillingHistoryCard';
import CurrrentPlanCard from '@/components/BillingCards/CurrentPlanCard';
import PaymentMethodsCard from '@/components/BillingCards/PaymentMethodsCard';
import { FC } from 'react';

const BillingScreen: FC = () => {
    return (
        <div className='flex flex-col gap-[24px] mt-[24px]'>
            <CurrrentPlanCard />
            <PaymentMethodsCard />
            <BillingHistoryCard />
        </div>
    );
};

export default BillingScreen;
