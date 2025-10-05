import React from 'react'

function EarningCard() {
  return (
    <div className='container-card p-4 rounded-[24px] flex flex-col justify-between gap-2'>
      <div className='text-white font-bold text-[24px] uppercase'>Earnings Summary</div>
      <div className='container-card p-4 rounded-[24px] flex flex-col justify-between h-full'>
        <span className='text-[12px] font-bold text-lighterAluminum'>
          Balance
        </span>
        <span className='text-[19px] font-bold text-white'>$1,250.00</span>
      </div>
      <div className='container-card p-4 rounded-[24px] flex flex-col justify-between h-full'>
        <span className='text-[12px] font-bold text-lighterAluminum uppercase'>
          Next Payout
        </span>
        <span className='text-[19px] font-bold text-white'>$500.00</span>
        <span className='text-[12px] font-bold text-lighterAluminum'>
          on Nov 15, 2025
        </span>
      </div>
    </div>
  );
}

export default EarningCard
