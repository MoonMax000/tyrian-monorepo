import React from 'react';
import { IndicatorTag } from '@/components/ui/IndicatorTag/IndicatorTag';
import EyeIcon from '@/assets/icons/icon-eye.svg';
import DownloadIcon from '@/assets/icons/icon-download.svg';
import SettingsIcon from '@/assets/icons/icon-settings.svg';

type PurchaseRowProps = {
  product: { icon: React.ReactNode; name: string };
  seller: string;
  price: string;
  status: string;
  date: string;
};

export function PurchaseRow({
  product,
  seller,
  price,
  status,
  date,
}: PurchaseRowProps) {
  return (
    <>
      <div className='flex items-center gap-2'>
        {product.icon}
        <span>{product.name}</span>
      </div>
      <span>{seller}</span>
      <span>{price}</span>
      <IndicatorTag
        className='w-fit flex h-fit'
        type={
          status === 'Trial' || status === 'Completed' ? 'darckGreen' : 'orange'
        }
      >
        {status}
      </IndicatorTag>
      <span>{date}</span>
      <div className='flex justify-center gap-2'>
        <EyeIcon />
        <DownloadIcon />
        <SettingsIcon />
      </div>
    </>
  );
}
