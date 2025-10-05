import React from 'react';
import Input from '../Input';
import BaseSelector from '../Selector/Base';
import UsdIcon from '@/assets/icons/usd.svg';

interface MonetizationProps {
  className?: string;
}

const options = [
  "Subscription",
  "Pay Once",
  "Free Trial",
];

export const Monetization: React.FC<MonetizationProps> = ({ className = '' }) => {
  return (
    <div className={`w-full ${className}`}>
      <div className='font-semibold text-[19px] leading-[26px] mb-2'>
      Monetization
      </div>
      <div className='flex gap-4'>
        <Input
          placeholder="Enter amount"
          className="flex-1"
          endIcon={<UsdIcon width={9} height={16} />}
        />

        <BaseSelector defaultValue={options[0]} options={options} className="flex-1"/>
      </div>
    </div>
  );
};

export default Monetization;
