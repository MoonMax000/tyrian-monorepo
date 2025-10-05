interface GainersLosersBarProps {
  gainersCount: number;
  losersCount: number;
}

const GainersLosersBar = ({ gainersCount, losersCount }: GainersLosersBarProps) => {
  const total = gainersCount + losersCount;
  const gainersPercent = Math.round((gainersCount / total) * 100);
  const losersPercent = 100 - gainersPercent;

  return (
    <div className='flex flex-col gap-2 w-full'>
      <div className='h-1 flex gap-0.5'>
        <div className='bg-green h-full rounded-l-sm' style={{ width: `${gainersPercent}%` }} />
        <div className='bg-red h-full rounded-r-sm' style={{ width: `${losersPercent}%` }} />
      </div>
      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-1'>
          <span className='text-xs font-semibold'>{gainersCount}</span>
          <span className='text-xs opacity-40'>({gainersPercent}%)</span>
        </div>
        <div className='flex items-center gap-1'>
          <span className='text-xs font-semibold'>{losersCount}</span>
          <span className='text-xs opacity-40'>({losersPercent}%)</span>
        </div>
      </div>
    </div>
  );
};

export default GainersLosersBar;
