import React from 'react';
import { IndicatorTag } from '@/components/ui/IndicatorTag/IndicatorTag';
import EyeIcon from '@/assets/icons/icon-eye.svg';
import DownloadIcon from '@/assets/icons/icon-download.svg';
import SettingsIcon from '@/assets/icons/icon-settings.svg';

type SubscriptionsProps = {
  product: { icon: React.ReactNode; name: string };
  plan: string;
  seller: string;
  price: string;
  period: string;
  startDate: string;
  nextPayment: string;
  status: string;
};

export function Subscriptions({
  product,
  plan,
  seller,
  price,
  period,
  startDate,
  nextPayment,
  status,
}: SubscriptionsProps) {
  return (
    <>
      <div className='flex items-center gap-2'>
        {product.icon}
        <span>{product.name}</span>
      </div>
      <span>{plan}</span>
      <span>{seller}</span>
      <span>
        {price}/ {period}
      </span>
      <span>{startDate}</span>
      <span>{nextPayment}</span>
      <IndicatorTag
        className='w-fit flex h-fit'
        type={status === 'Completed' ? 'darckGreen' : 'red'}
      >
        {status}
      </IndicatorTag>
      <div className='flex justify-center gap-2'>
        <EyeIcon />
        <DownloadIcon />
        <SettingsIcon />
      </div>
    </>
  );
}
