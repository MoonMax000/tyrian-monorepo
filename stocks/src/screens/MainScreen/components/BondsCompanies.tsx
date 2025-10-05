import Paper from '@/components/Paper';
import clsx from 'clsx';
import Link from 'next/link';
import Image from 'next/image';

const headings = [
  { name: 'Instument', key: 'tool' },
  { name: 'Yield to maturity (YTM)', key: 'profitability' },
  { name: 'Maturity date', key: 'term' },
] as const;

type HeadingKeys = (typeof headings)[number]['key'];

const mockData: Record<HeadingKeys, string>[] = [
  {
    tool: 'Green Plains Inc. 2.25% 15-MAR-2027',
    profitability: '9.96%',
    term: '15.03.2027',
  },
  {
    tool: 'Green Plains Inc. 2.25% 15-MAR-2027',
    profitability: '9.96%',
    term: '15.03.2027',
  },
  {
    tool: 'Green Plains Inc. 2.25% 15-MAR-2027',
    profitability: '9.96%',
    term: '15.03.2027',
  },
  {
    tool: 'Green Plains Inc. 2.25% 15-MAR-2027',
    profitability: '9.96%',
    term: '15.03.2027',
  },
  {
    tool: 'Green Plains Inc. 2.25% 15-MAR-2027',
    profitability: '9.96%',
    term: '15.03.2027',
  },
  {
    tool: 'Green Plains Inc. 2.25% 15-MAR-2027',
    profitability: '9.96%',
    term: '15.03.2027',
  },
];

const BondsCompanies = () => {
  return (
    <Paper className='!p-0'>
      <div className='flex items-center justify-between px-6 pt-6 pb-4'>
        <h4 className='text-h4'>Corporate Bonds</h4>
      </div>

      <ul className='bg-moonlessNight px-6 py-4 grid grid-cols-[60%,1fr,1fr] justify-between gap-2'>
        {headings.map((heading, index) => (
          <li
            key={heading.key}
            className={clsx('text-body-12 font-semibold opacity-48 uppercase', {
              'text-center': index === 1,
              'text-right': index === 2,
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
            className='grid grid-cols-[60%,1fr,1fr] justify-between gap-2 p-6 border-b border-[#FFFFFF0A] last:border-none'
          >
            {headings.map((heading, listItemIndex) => (
              <p
                key={heading.key}
                className={clsx('text-body-15 last:opacity-48', {
                  'text-center': listItemIndex === 1,
                  'text-right': listItemIndex === 2,
                })}
              >
                {item[heading.key]}
              </p>
            ))}
          </li>
        ))}
      </ul>
    </Paper>
  );
};

export default BondsCompanies;
