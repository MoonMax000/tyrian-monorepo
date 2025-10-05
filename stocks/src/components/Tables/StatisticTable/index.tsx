import clsx from 'clsx';

interface CointryStatisticsDataItem {
  indicator: string;
  period: string;
  last_price: string;
}

const StatisticsTable = ({ data }: { data: CointryStatisticsDataItem[] }) => {
  const statisticsHeading = [
    { name: 'Indicator', key: 'indicator' },
    { name: 'Period', key: 'period' },
    { name: 'Last Price', key: 'last_price' },
  ];

  return (
    <>
      <ul className='bg-moonlessNight px-6 py-4 grid grid-cols-[40%,30%,30%] rounded-t-xl'>
        {statisticsHeading.map((heading, index) => (
          <li
            key={heading.key}
            className={clsx('text-body-12 font-semibold opacity-48 uppercase', {
              'text-right': index === 2,
              'text-left': index === 0,
            })}
          >
            {heading.name}
          </li>
        ))}
      </ul>

      <ul>
        {data.map((item, index) => (
          <li
            key={`${item.indicator}-${index}`}
            className='p-6 py-[14px] grid grid-cols-[40%,30%,30%] items-center justify-between  bg-blackedGray last:rounded-b-xl even:bg-moonlessNight'
          >
            <p className='text-body-15 line-clamp-1'>{item.indicator}</p>
            <p className='text-body-15 line-clamp-1 opacity-[48%]'>{item.period}</p>
            <p className='text-body-15 line-clamp-1 text-right'>{item.last_price}</p>
          </li>
        ))}
      </ul>
    </>
  );
};

export default StatisticsTable;
