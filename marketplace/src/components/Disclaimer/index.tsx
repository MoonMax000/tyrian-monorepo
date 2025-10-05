import type { FC } from 'react';

import Paper from '@/components/UI/Paper';

const Disclaimer: FC = () => (
  <Paper>
    <div className='p-4 border-b-[1px] border-gunpowder'>
      <h3 className='text-[19px] font-bold text-purple'>Disclaimer</h3>
    </div>
    <div className='p-4'>
      <p className='text-[15px] font-medium text-lighterAluminum'>
        The information and publications are not meant to be, and do not constitute, financial,
        investment, trading, or other types of advice or recommendations supplied or endorsed by
        TyrianTrade. Read more in the{' '}
        <span className='text-purple underline cursor-pointer'>Terms of Use</span>
      </p>
    </div>
  </Paper>
);

export default Disclaimer;
