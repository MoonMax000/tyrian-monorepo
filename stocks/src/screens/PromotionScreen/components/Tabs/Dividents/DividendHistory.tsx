import Paper from '@/components/Paper';
import clsx from 'clsx';
import Link from 'next/link';

const headings = [
  { name: 'Период', key: 'duration', symbol: 'г.' },
  { name: 'Последний день покупки акций', key: 'last_date' },
  { name: 'Дата закрытия реестра акционеров', key: 'closing_date' },
  { name: 'Цена акции', key: 'stock_price', symbol: '₽' },
  { name: 'Дивиденд на акцию', key: 'dividend_on_stocks', symbol: '₽' },
  { name: 'Доходность', key: 'profitability', symbol: '%' },
] as const;

type Keys = (typeof headings)[number]['key'];

const mockData: Record<Keys, string>[] = [
  {
    duration: '2 кв. 2024',
    last_date: '09.05.2024',
    closing_date: '13.05.2024',
    stock_price: '199.8',
    dividend_on_stocks: '25',
    profitability: '20',
  },
  {
    duration: '1 кв. 2024',
    last_date: '08.02.2024',
    closing_date: '12.02.2024',
    stock_price: '188.84',
    dividend_on_stocks: '25',
    profitability: '20',
  },
  {
    duration: '4 кв. 2023',
    last_date: '09.11.2023',
    closing_date: '13.05.2024',
    stock_price: '199.8',
    dividend_on_stocks: '22',
    profitability: '17',
  },
  {
    duration: '3 кв. 2023',
    last_date: '10.08.2023',
    closing_date: '13.05.2024',
    stock_price: '199.8',
    dividend_on_stocks: '22',
    profitability: '17',
  },
  {
    duration: '2 кв. 2023',
    last_date: '11.05.2023',
    closing_date: '13.05.2024',
    stock_price: '199.8',
    dividend_on_stocks: '22',
    profitability: '17',
  },
  {
    duration: '1 кв. 2023',
    last_date: '09.02.2023',
    closing_date: '13.05.2024',
    stock_price: '199.8',
    dividend_on_stocks: '21',
    profitability: '18',
  },
  {
    duration: '4 кв. 2022',
    last_date: '03.11.2022',
    closing_date: '13.05.2024',
    stock_price: '199.8',
    dividend_on_stocks: '19',
    profitability: '17',
  },
  {
    duration: '3 кв. 2022',
    last_date: '04.08.2022',
    closing_date: '13.05.2024',
    stock_price: '199.8',
    dividend_on_stocks: '19',
    profitability: '16',
  },
];

const DividendHistory = () => {
  return (
    <Paper className='!px-0'>
      <div className='flex items-center justify-between px-6'>
        <h3 className='text-h4 '>История дивидендов с 2014 по 2024 год</h3>
        <Link
          href='/calendar-2024'
          className='text-body-15 underline underline-offset-2 text-purple'
        >
          {'Дивидендный календарь 2024 >'}
        </Link>
      </div>

      <ul className='mt-4 bg-moonlessNight px-6 py-4 grid grid-cols-[repeat(6,max-content)] gap-6 items-center justify-between'>
        {headings.map((heading, index) => (
          <li key={heading.key} className='w-full'>
            <p
              className={clsx('w-max text-body-12 font-semibold opacity-[48%] uppercase', {
                'text-right float-right': index === headings.length - 1,
                'text-left': index === 0,
                'text-center': index !== 0 && index !== headings.length - 1,
              })}
            >
              {heading.name}
            </p>
          </li>
        ))}
      </ul>
      <ul>
        {mockData.map((data, index) => (
          <li
            key={index}
            className='grid grid-cols-[repeat(6,max-content)] gap-6 items-center justify-between p-6'
          >
            {headings.map((head, itemIndex) => (
              <p
                key={head.key}
                className={clsx('text-body-15 w-full', {
                  'text-left': itemIndex === 0,
                  'text-center': itemIndex !== 0,
                })}
              >
                {data[head.key]} {'symbol' in head && head.symbol}
              </p>
            ))}
          </li>
        ))}
      </ul>
    </Paper>
  );
};

export default DividendHistory;
