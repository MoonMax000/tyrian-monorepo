import React from 'react';
import clsx from 'clsx';
import Indicator from '@/assets/coins-stats/indicator.svg';

const LiveItem = ({ className, symbol }: { className?: string, symbol: string }) => {
  return <div className={clsx("flex flex-col gap-3 pt-6 pb-6 px-6 border-white border-b border-opacity-10 last:pb-0 last:border-b-0", className)}>
    <h6 className="text-lg font-bold">Binance</h6>
    <div className="flex gap-8 items-center">
      <span className="text-[15px] font-semibold whitespace-nowrap">2 976.82</span>
      <div className="flex gap-1 items-end">
        <div className="text-[#2ebd85] text-[13px] font-bold p-1 rounded bg-[#2ebd85] bg-opacity-10 flex">-4.39%</div>
        <Indicator />
        <div className="text-[#ef454a] text-[13px] font-bold p-1 rounded bg-[#ef454a] bg-opacity-10">-7.18%</div>
      </div>
      <span className="text-[15px] font-semibold whitespace-nowrap">2 976.82</span>
    </div>
  </div>
}

export default LiveItem;