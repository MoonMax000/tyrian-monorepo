'use client';

import Paper from '@/components/Paper';
import { mockProfitabilityData } from '../Review/constants';
const ProfitAssets = () => {
  return (
    <Paper className='!px-0 py-6'>
      <h3 className='text-h4 mx-6'>Доходность актива</h3>

      <ul className='mt-6 mb-7'>
        {mockProfitabilityData.map((item) => (
          <li
            key={item.value}
            className='flex items-center justify-between even:bg-moonlessNight py-[9px] px-6'
          >
            <p className='text-body-15'>{item.label}</p>
            <p className='text-body-15'>{item.value}</p>
          </li>
        ))}
      </ul>

      <div className='flex items-center justify-between mx-6'>
        <p className='text-body-15'>Оценка доходности</p>
        <p className='text-body-15'>3/5</p>
      </div>
    </Paper>
  );
};

export default ProfitAssets;
