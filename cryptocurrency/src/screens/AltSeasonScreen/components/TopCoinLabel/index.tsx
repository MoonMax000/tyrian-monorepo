import { FC } from 'react';
import Image from 'next/image';

interface TopCoinLabelProps {
  name: string;
  icon?: string;
  percentage: number;
}

const TopCoinLabel: FC<TopCoinLabelProps> = ({ name, icon, percentage }) => {
  const isPositive = percentage >= 0;
  const backgroundColor = isPositive ? '#2EBD85' : '#EF454A';

  const formattedPercentage = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(percentage));

  return (
    <div className='flex items-center gap-2 py-2 px-3 rounded-lg' style={{ backgroundColor }}>
      <div className='flex items-center gap-2'>
        <Image
          src={icon ? icon : '/coins/icon-default.svg'}
          alt={name}
          width={22}
          height={22}
          className='rounded-full'
        />

        <p className='text-xs font-bold'>{name}</p>
      </div>
      <p className='text-xs font-bold'>
        {isPositive ? '+' : '-'}
        {formattedPercentage} %
      </p>
    </div>
  );
};

export default TopCoinLabel;
