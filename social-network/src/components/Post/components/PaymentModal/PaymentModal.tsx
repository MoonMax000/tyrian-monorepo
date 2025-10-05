import { Button } from '@/components/UI/Button';
import React from 'react';

export const PaymentModal = () => {
  return (
    <div className='flex py-2 flex-col gap-4 !w-full'>
      <h2 className='font-bold text-[19px]'>New Tools for Crypto Analytics</h2>
      <p className='text-[#B0B0B0] font-medium text-[15px]'>
        You are about to purchase this material. Once purchased, you will have lifetime access to
        this content.
      </p>
      <span className='font-bold text-[24px]'>$9.99</span>
      <span className='text-purple text-[15px] pb-2 font-bold border-b-[1px] border-regaliaPurple'>
        One-time payment
      </span>
      <p className='text-[#B0B0B0] font-medium text-[15px]'>
        You will be redirected to the payment service to complete your purchase.
      </p>
      <div className='flex w-full justify-between'>
        <Button className='min-w-[224px] bg-transparent border border-regaliaPurple'>Cancel</Button>
        <Button variant='gradient' className='min-w-[224px] hover:bg-white'>
          Buy Now
        </Button>
      </div>
    </div>
  );
};
