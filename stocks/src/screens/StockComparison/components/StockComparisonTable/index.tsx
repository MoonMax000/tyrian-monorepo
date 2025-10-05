import Paper from '@/components/Paper';
import TableItem from './TableItem';

const headings: { name: string; key: string }[] = [
  { name: '12.01.25', key: 'heading' },
  { name: 'NVIDIA', key: 'nvidia' },
  { name: 'Apple', key: 'apple' },
  { name: '--', key: '-' },
  { name: '--', key: '-' },
] as const;

const mockData = [
  {
    heading: 'Market Value',
    nvidia: '$384T',
    apple: '$399T',
    withGraphic: true,
  },
  {
    heading: 'Market Capitalization',
    nvidia: '$381T',
    apple: '$404T',
    withGraphic: true,
  },
  {
    heading: 'P/E Ratio',
    nvidia: '57.04',
    apple: '40.03',
    withGraphic: true,
  },
  {
    heading: 'Deluted EPS',
    nvidia: '2.53',
    apple: '6.08',
    withGraphic: true,
  },
  {
    heading: 'Yield & Dividend Forecast',
    nvidia: '00.4 (00.3%)',
    apple: '1.00 (0.41%)',
    withGraphic: true,
  },
  {
    heading: 'Sector',
    nvidia: 'IT',
    apple: 'IT',
  },
  {
    heading: 'Industry',
    nvidia: 'Semiconductors',
    apple: 'Data Storage & Peripherals',
  },
  {
    heading: 'СЕО',
    nvidia: 'Jensen Huang',
    apple: 'Tim Cook',
  },
];

const StockComparisonTable = () => {
  return (
    <Paper className='!p-0 mb-6'>
      <ul className='mt-4 bg-moonlessNight px-6 py-4 grid grid-cols-[repeat(5,1fr)] gap-6 items-center justify-between'>
        {headings.map((heading, index) => (
          <li key={`${index}-${heading.key}`} className='w-full'>
            <p className='w-max text-body-12 font-semibold'>{heading.name}</p>
          </li>
        ))}
      </ul>
      <ul>
        {mockData.map((data, index) => (
          <TableItem key={index} data={data} headings={headings} withGraphic={data.withGraphic} />
        ))}
      </ul>
    </Paper>
  );
};

export default StockComparisonTable;
