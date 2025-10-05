import Paper from '@/components/Paper';
import clsx from 'clsx';
import Link from 'next/link';
import { FC } from 'react';
import Image from 'next/image';

const headings = [
  { name: 'Indicator', key: 'indicator' },
  { name: 'period', key: 'period' },
  { name: 'last value', key: 'last_price' },
] as const;

type Keys = (typeof headings)[number]['key'];

export type CointryStatisticsDataItem = Record<Keys, string>;

interface CountryStaticticsProps {
  heading: string;
  link: string;
  linkName: string;
  data: CointryStatisticsDataItem[];
}

const CountryStatictics: FC<CountryStaticticsProps> = ({ link, linkName, heading, data }) => {
  return (
    <Paper className='!p-0'>
      <div className='flex items-center justify-between px-6 pt-6 pb-4'>
        <h4 className='text-h4'>{heading}</h4>
        <Link href={link} className='text-body-15 text-purple flex items-center gap-[10px]'>
          {linkName}
          <Image src='/arrow-circuled.svg' alt='arrow' width={5.52} height={7.06} />
        </Link>
      </div>

      <ul className='bg-moonlessNight px-6 py-4 grid grid-cols-[45%,1fr,1fr] justify-between gap-2'>
        {headings.map((heading, index) => (
          <li
            key={heading.key}
            className={clsx('text-body-12 font-semibold opacity-48 uppercase', {
              'text-right': index > 0,
            })}
          >
            {heading.name}
          </li>
        ))}
      </ul>

      <ul>
        {data.map((item, index) => (
          <li
            key={index}
            className='grid grid-cols-[45%,1fr,1fr] justify-between gap-3 p-6 border-b border-[#FFFFFF0A] last:border-none'
          >
            {headings.map((heading, listItemIndex) => (
              <p
                key={heading.key}
                className={clsx(
                  'text-body-15 font-semibold even:opacity-48 even:text-body-12 even:leading-4',
                  {
                    'text-right': listItemIndex > 0,
                  },
                )}
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

export default CountryStatictics;
