import React from 'react';

interface ScaleItem {
  name: string;
  percentage: number;
  color: string;
}

const items: ScaleItem[] = [
  {
    name: 'BITCOIN',
    percentage: 59.9,
    color: '#A06AFF',
  },
  {
    name: 'ETHEREUM',
    percentage: 10,
    color: '#6aa6ff',
  },
];

const DominateScale = () => {
  const totalPercentage = items.reduce((sum, item) => sum + item.percentage, 0);
  const remainingPercentage = totalPercentage < 100 ? 100 - totalPercentage : 0;

  const fullItems =
    remainingPercentage > 0
      ? [...items, { name: 'OTHER', percentage: remainingPercentage, color: '#4f5156' }]
      : items;

  return (
    <div className='w-full max-w-md mx-auto'>
      <div className='relative flex justify-between mb-2'>
        {fullItems.map((item, index) => (
          <div
            key={index}
            className='flex items-center justify-center gap-2'
            style={{ left: `${item.percentage}%` }}
          >
            <div className='size-2 rounded-full' style={{ backgroundColor: item.color }} />
            <p className='text-xs font-bold text-webGray uppercase'>
              {item.name}
              <span className='text-white'> - {Math.round(item.percentage)}%</span>
            </p>
          </div>
        ))}
      </div>
      <div className='relative h-3 rounded-full overflow-hidden'>
        <div className='absolute inset-0 flex'>
          {fullItems.map((item, index) => (
            <div
              key={index}
              className='h-full'
              style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DominateScale;
