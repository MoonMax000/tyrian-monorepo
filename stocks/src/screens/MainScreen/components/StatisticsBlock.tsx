import Paper from '@/components/Paper';
import Button from '@/components/UI/Button';
import { FC, ReactNode } from 'react';
import IconCompany from '@/assets/icons/landing/company.svg';
import IconVisualization from '@/assets/icons/landing/visualization.svg';
import IconDividends from '@/assets/icons/landing/dividends.svg';
import IconAutoAnalyze from '@/assets/icons/landing/autoanalyze.svg';
import IconDots from '@/assets/icons/landing/dots.svg';
import IconNews from '@/assets/icons/landing/news.svg';
import Link from 'next/link';

interface StatisticItem {
  name: string;
  description: string;
  icon: ReactNode;
  link?: string;
}

const list: StatisticItem[] = [
  {
    name: '60,000+ Companies in Database',
    description: 'Analyze Stocks from 40+ Countries',
    icon: <IconCompany />,
  },
  {
    name: 'Data Visualization',
    description: '30 Years of Price Charts & Financial Metrics',
    icon: <IconVisualization />,
  },
  {
    name: 'Dividends',
    description: 'Dividend Insights: Recommendations, Amounts, Dates & Yield Trends',
    icon: <IconDividends />,
  },
  {
    name: 'Automated Stock Analysis',
    description: 'Our Algorithms Know Which Stocks to Buy',
    icon: <IconAutoAnalyze />,
  },
  {
    name: '150+ Financial Ratios',
    description: 'Screen the Most Overvalued & Undervalued Stocks',
    icon: <IconDots />,
  },
  {
    name: 'News',
    description: 'All Company News from Trusted Sources in One Place',
    icon: <IconNews />,
    link: '/market-news',
  },
];

const StatisticItem: FC<{ item: StatisticItem }> = ({ item }) => {
  return item.link ? (
    <Paper className='!py-4 flex flex-col gap-[74px]'>
      <div className='flex items-center justify-center size-[48px] bg-[#A06AFF29] rounded-[50%] text-purple'>
        {item.icon}
      </div>
      <Link href={item.link}>
        <div className='flex flex-col gap-4'>
          <p className='text-body-15'>{item.name}</p>
          <p className='text-body-15 opacity-[48%]'>{item.description}</p>
        </div>
      </Link>
    </Paper>
  ) : (
    <Paper className='!py-4 flex flex-col gap-[74px]'>
      <div className='flex items-center justify-center size-[48px] bg-[#A06AFF29] rounded-[50%] text-purple'>
        {item.icon}
      </div>

      <div className='flex flex-col gap-4'>
        <p className='text-body-15'>{item.name}</p>
        <p className='text-body-15 opacity-[48%]'>{item.description}</p>
      </div>
    </Paper>
  );
};

const StatisticsBlock = () => {
  return (
    <div className='flex flex-col gap-6'>
      <ul className='grid grid-cols-4 gap-6'>
        {list.slice(0, 4).map((item) => (
          <li key={item.name}>
            <StatisticItem item={item} />
          </li>
        ))}
      </ul>
      <ul className='grid grid-cols-[1fr,1fr,calc(50%-12px)] gap-6'>
        {list.slice(4, 6).map((item) => (
          <li key={item.name}>
            <StatisticItem item={item} />
          </li>
        ))}

        <li>
          <Paper className='flex flex-col justify-between gap-[74px] h-full'>
            <p className='text-h4'>Earn More by Analyzing Stocks in Just 5 Minutes</p>

            <Button className='!w-[180px] !h-10 ml-auto'>Sign Up</Button>
          </Paper>
        </li>
      </ul>
    </div>
  );
};

export default StatisticsBlock;
