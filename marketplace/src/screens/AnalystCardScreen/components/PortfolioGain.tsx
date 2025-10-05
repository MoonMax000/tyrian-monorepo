import type { FC } from 'react';

import ProcentLabel from '@/components/UI/ProcentLabel';
import DescriptionCard from '@/components/UI/DescriptionCard';

type PortfolioGain = {
  oneMonth: number;
  sixMonth: number;
  year: number;
  ytd: number;
  total: number;
};

interface IPortfolioGainProps {
  portfolioGain: PortfolioGain;
}

export const PortfolioGain: FC<IPortfolioGainProps> = ({ portfolioGain }) => {
  const portfolioGainList = [
    { label: '1-Month Return', value: portfolioGain.oneMonth },
    { label: '6-Month Return', value: portfolioGain.sixMonth },
    { label: '12-Month Return', value: portfolioGain.year },
    { label: 'YTD Return', value: portfolioGain.ytd },
    { label: 'Total Return', value: portfolioGain.total },
  ];

  return (
    <DescriptionCard title='Portfolio Gain'>
      <ul className='flex flex-col gap-y-8'>
        {portfolioGainList.map(({ label, value }) => (
          <li key={label} className='flex items-center gap-x-4 justify-between'>
            <span className='text-[15px] font-medium text-lighterAluminum'>{label}</span>
            <ProcentLabel value={value} border withSymbols toFixed={2} />
          </li>
        ))}
      </ul>
    </DescriptionCard>
  );
};
