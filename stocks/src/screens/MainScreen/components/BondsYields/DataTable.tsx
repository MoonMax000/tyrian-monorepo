import clsx from 'clsx';

const headings = [
  { name: 'Instrument', key: 'tool' },
  { name: 'Yield', key: 'profitability' },
  { name: 'Yield Δ, 1d', key: 'profitability_change_one_day' },
  { name: 'Price', key: 'price' },
  { name: 'Price Δ, 1d', key: 'price_change_one_day' },
  { name: 'years to Maturity', key: 'term_to_maturity' },
  { name: 'Maturity date', key: 'replayment_period' },
] as const;

type Keys = (typeof headings)[number]['key'];

const mockData: Record<Keys, string | number>[] = [
  {
    tool: '1 year',
    profitability: 18.942,
    profitability_change_one_day: -0.55,
    price: 89.48,
    price_change_one_day: 0.08,
    term_to_maturity: '1 year',
    replayment_period: '16.07.2025',
  },
  {
    tool: '2 years',
    profitability: 17.946,
    profitability_change_one_day: -2.02,
    price: 92.87,
    price_change_one_day: 0.28,
    term_to_maturity: '2 years',
    replayment_period: '23.07.2026',
  },
  {
    tool: '5 years',
    profitability: 16.808,
    profitability_change_one_day: -1.15,
    price: 73.31,
    price_change_one_day: 0.33,
    term_to_maturity: '5 years',
    replayment_period: '14.03.2029',
  },
  {
    tool: '10 years',
    profitability: 16.348,
    profitability_change_one_day: 1.66,
    price: 62.64,
    price_change_one_day: 0.02,
    term_to_maturity: '10 years',
    replayment_period: '10.05.2034',
  },
  {
    tool: '15 years',
    profitability: 16.146,
    profitability_change_one_day: 3.37,
    price: 59.16,
    price_change_one_day: -0.05,
    term_to_maturity: '15 years',
    replayment_period: '16.03.2039',
  },
  {
    tool: '20 years',
    profitability: 16.146,
    profitability_change_one_day: 3.37,
    price: 59.16,
    price_change_one_day: 0.04,
    term_to_maturity: '20 yaers',
    replayment_period: '16.03.2039',
  },
];

const DataTable = () => {
  return (
    <>
      <ul className='bg-moonlessNight px-6 py-4 grid grid-cols-[repeat(7,1fr)] justify-between gap-2'>
        {headings.map((heading, index) => (
          <li
            key={heading.key}
            className={clsx('text-body-12 font-semibold opacity-48 uppercase', {
              'text-right': index === headings.length - 1
            })}
          >
            {heading.name}
          </li>
        ))}
      </ul>

      <ul>
        {mockData.map((item, index) => (
          <li
            key={index}
            className='grid grid-cols-[repeat(7,1fr)] justify-between gap-2 p-6 border-b border-[#FFFFFF0A] last:border-none'
          >
            {headings.map((heading, listItemIndex) => {
              const value = item[heading.key];
              const isPercentValue =
                heading.key === 'price_change_one_day' ||
                heading.key === 'profitability_change_one_day';
              return (
                <p
                  key={heading.key}
                  className={clsx('text-body-15 last:opacity-48', {
                    'text-right': listItemIndex === headings.length - 1,
                    'text-red': isPercentValue && (value as number) < 0,
                    'text-green': isPercentValue && (value as number) > 0,
                  })}
                >
                  {isPercentValue && (value as number) > 0 ? '+' : ''}
                  {value}
                  {isPercentValue && '%'}
                </p>
              );
            })}
          </li>
        ))}
      </ul>
    </>
  );
};

export default DataTable;
