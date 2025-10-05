import { IEentry, LegendKeys, TLegendkeys } from './constants';

export const tickFormatter = (value: number): string => {
  const sign = value < 0 ? '-' : '';
  const absValue = Math.abs(value);

  if (absValue >= 1_000) {
    if (absValue > 1_000_000_000) {
      return `${sign}${Math.round(absValue / 10_000_000)}B`;
    }
    if (absValue > 1_000_000) {
      return `${sign}${Math.round(absValue / 10_000)}M`;
    }

    return `${sign}${Math.round(absValue / 1_000)}T`;
  }
  return `${value}`;
};
export const renderColorfulLegendText = (value: TLegendkeys, entry: IEentry) => {
  const { color } = entry;
  console.log('Color', color);
  //tailwind не справился поэтому тут style
  return (
    <div className='flex gap-2 items-center mr-2'>
      <div className='w-4 h-4  rounded-full' style={{ backgroundColor: color }}></div>
      <span style={{ color: '#FFFFFF', opacity: '0.3' }} className='uppercase text-body-12'>
        {LegendKeys[value] || value}
      </span>
    </div>
  );
};
