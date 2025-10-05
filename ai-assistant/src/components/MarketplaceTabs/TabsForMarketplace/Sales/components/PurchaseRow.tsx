import React from 'react';
import { IndicatorTag } from '@/components/ui/IndicatorTag/IndicatorTag';
import EyeIcon from '@/assets/purple-eye.svg';
import ContainerIcon from '@/assets/container.svg';
import CommentsIcon from '@/assets/commentsv2.svg';

type SalesRowProps = {
  orderNumber: string;
  buyer: string;
  product: string;
  amount: string;
  status: string;
  date: string;
};

export function SalesRow({
  orderNumber,
  product,
  buyer,
  amount,
  status,
  date,
}: SalesRowProps) {
  return (
    <>
      <span>{orderNumber}</span>
      <span>{buyer}</span>
      <span>{product}</span>
      <span>{amount}</span>
      <IndicatorTag
        className='w-fit flex h-fit'
        type={status === 'Completed' ? 'darckGreen' : 'orange'}
      >
        {status}
      </IndicatorTag>
      <span>{date}</span>
      <div className='flex justify-center gap-2'>
        <EyeIcon />
        <ContainerIcon />
        <CommentsIcon />
      </div>
    </>
  );
}
