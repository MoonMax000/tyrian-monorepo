import React from 'react';
import { IndicatorTag } from '@/components/ui/IndicatorTag/IndicatorTag';
import EyeIcon from '@/assets/icons/icon-eye.svg';
import PencilIcon from '@/assets/icons/pencil.svg';
import TrashIcon from '@/assets/icons/icon-trash.svg';
import DownloadIcon from '@/assets/icons/icon-download.svg';
import { ratingStars } from '../Reviews/components/ReviewRow';
import RatingStarIcon from '@/assets/icons/icon-rating-star.svg';

interface MyProductsRowProps {
  product: { icon: React.ReactNode; name: string };
  seller: string;
  price: string;
  status: string;
  date: string;
  rating: number;
  billing: string;
  sales: string;
  index: number;
  length: number;
}

export const MyProductsRow = ({
  product,
  index,
  seller,
  price,
  status,
  date,
  rating,
  billing,
  length,
  sales,
}: MyProductsRowProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published':
        return 'darckGreen';
      case 'Draft':
        return 'orange';
      case 'Inactive':
        return 'red';
      default:
        return 'darckGreen';
    }
  };
  return (
    <>
      <div className='flex items-center gap-2'>
        {product.icon}
        <span>{product.name}</span>
      </div>
      <span>{seller}</span>
      <span>{billing}</span>
      <span>{sales}</span>
      <span>{date}</span>
      <div className='flex items-start  gap-1 '>
        <span className='flex gap-1 pt-[2px]'>
          {ratingStars.map((star) => (
            <RatingStarIcon
              key={star}
              className={`${
                star <= rating ? 'text-primary' : 'text-gunpowder'
              }`}
            />
          ))}
        </span>
        <span className='flex h-full'>{rating + '.0'}</span>
      </div>
      <span>{price}</span>

      <IndicatorTag
        className='w-fit flex h-fit'
        type={index === length - 1 ? 'moonless' : getStatusColor(status)}
      >
        {status}
      </IndicatorTag>

      <div className='flex justify-center gap-2'>
        <DownloadIcon />
        <EyeIcon />
        <PencilIcon />
        <TrashIcon />
      </div>
    </>
  );
};
