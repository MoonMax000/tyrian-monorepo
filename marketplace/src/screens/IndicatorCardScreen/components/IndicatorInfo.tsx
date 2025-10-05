import type { FC } from 'react';

import Paper from '@/components/UI/Paper';
import List from '@/components/UI/List';

const settingsListMock = [
  'Data Length: Select how many bars to use per data point',
  'Distribution Length: Select how many data points the distribution will have',
  'Base Level: Choose between 4 different trailing levels',
];

const dashboardListMock = [
  'Show Statistics: Enable/disable dashboard',
  'Position: Select dashboard position',
  'Size: Select dashboard size',
];

const indicatorList = [
  {
    label: 'Overview',
    content: (
      <div className='flex flex-col gap-y-4 text-[15px] font-medium'>
        <p>
          The Statistical Trailing Stop tool offers traders a way to lock in profits in trending
          markets with four statistical levels based on the log-normal distribution of volatility
        </p>
        <p>The indicator also features a dashboard with statistics of all detected signals.</p>
      </div>
    ),
  },
  {
    label: 'Usage',
    content: (
      <div className='flex flex-col gap-y-4 text-[15px] font-medium'>
        <p>
          The tool works out of the box, traders can adjust the data used with two parameters: data
          & distribution length.
        </p>
        <p>
          By default, the tool takes volatility measures of groups of 10 candles, and statistical
          measures of the last 100 of these groups. Then traders can adjust the base level to use as
          trailing. The larger the level, the more resistant the tool will be to moves against the
          trend.
        </p>
      </div>
    ),
  },
  {
    label: 'Settings',
    content: <List list={settingsListMock} />,
  },
  {
    label: 'Dashboard',
    content: <List list={dashboardListMock} />,
  },
];

export const IndicatorInfo: FC = () => (
  <Paper className='p-4'>
    <div className='flex flex-col gap-y-4'>
      {indicatorList.map(({ label, content }) => (
        <div key={label} className='flex flex-col gap-y-4'>
          <h3 className='text-[19px] font-bold text-purple'>{label}</h3>
          {content}
        </div>
      ))}
    </div>
  </Paper>
);
