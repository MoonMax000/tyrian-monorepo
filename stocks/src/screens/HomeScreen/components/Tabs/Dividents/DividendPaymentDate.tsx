import Paper from '@/components/Paper';
import { Tooltip } from 'react-tooltip';
import IconInfoCirle from '@/assets/icons/info-circle.svg';

const mockData = {
  lastDayOfBuy: {
    label: 'Last Day to Buy Shares',
    tooltip: 'Lorem ipsum',
    value: '09.05.2024',
  },
  closingDate: {
    label: 'Shareholder Record Date',
    tooltip: 'Lorem ipsum',
    value: '13.05.2024',
  },
  dividendOnStock: {
    label: 'Dividend Per Share (DPS)',
    tooltip: 'Lorem ipsum',
    value: '$50',
  },
  dividendProfitability: {
    label: 'Dividend Yield',
    tooltip: 'Lorem ipsum',
    value: '0.14%',
  },
};

const DividendPaymentDate = () => {
  return (
    <Paper className='!px-0'>
      <h4 className='text-h4 mx-6'>Dividend Payment Date</h4>

      <ul className='border-t-2 border-moonlessNight mt-4'>
        {Object.keys(mockData).map((key) => {
          const item = mockData[key as keyof typeof mockData];
          return (
            <li
              key={key}
              className='px-6 py-[9px] flex items-center justify-between gap-2 even:bg-moonlessNight'
            >
              <div className='flex items-center gap-[6px]'>
                <p className='text-body-15 opacity-[48%]'>{item.label}</p>
                <IconInfoCirle
                  className='size-4 opacity-[48%]'
                  data-tooltip-id={key}
                  data-tooltip-content={item.tooltip}
                />
                <Tooltip id={key} />
              </div>

              <p className='text-body-15'>{item.value}</p>
            </li>
          );
        })}
      </ul>
    </Paper>
  );
};

export default DividendPaymentDate;
