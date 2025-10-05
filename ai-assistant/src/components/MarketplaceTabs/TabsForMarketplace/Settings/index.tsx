'use client';

import React, { useState } from 'react';
import Paper from '@/components/ui/Paper/Paper';
import Checkbox from '@/components/ui/Checkbox/Checkbox';

function SettingsTab() {
  const [checked, setChecked] = useState({
    sale: false,
    review: false,
    payout: false,
  });

  return (
    <div className='flex flex-col gap-[24px]'>
      <div className='text-white font-bold text-[24px]'>Settings</div>
      <Paper className='p-4 border border-[#181B22] flex flex-col gap-6'>
        <span className='text-white font-bold text-[24px]'>Policies</span>
        <div className='grid grid-cols-[50%_50%] gap-y-2 text-[15px] font-[700]'>
          <span>Refund Policy</span>
          <span>Support Email</span>
          <span>
            All sales are final. We do not offer refunds or exchanges for
            digital products.
          </span>
          <span>support@mystore.com</span>
        </div>
      </Paper>
      <Paper className='p-4 border border-[#181B22] flex flex-col gap-6'>
        <span className='text-white font-bold text-[24px]'>Notifications</span>
        <div className='flex flex-col gap-4 text-[15px] font-[700]'>
          <div className='flex items-center gap-2'>
            <Checkbox
              checked={checked.sale}
              onChange={(val) => setChecked((p) => ({ ...p, sale: val }))}
              label='New Sale'
            />
          </div>
          <div className='flex items-center gap-2'>
            <Checkbox
              checked={checked.review}
              onChange={(val) => setChecked((p) => ({ ...p, review: val }))}
              label='New Review'
            />
          </div>
          <div className='flex items-center gap-2'>
            <Checkbox
              checked={checked.payout}
              onChange={(val) => setChecked((p) => ({ ...p, payout: val }))}
              label='Payout'
            />
          </div>
        </div>
      </Paper>
    </div>
  );
}

export default SettingsTab;
