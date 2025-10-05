import Paper from '@/components/Paper';
import { Tooltip } from 'react-tooltip';
import IconInfoCirle from '@/assets/icons/info-circle.svg';

const mockData = {
  lastDayOfBuy: {
    label: 'Последний день покупки акций',
    tooltip: 'Lorem ipsum',
    value: '09.05.2024',
  },
  closingDate: {
    label: 'Дата закрытия реестра акционеров',
    tooltip: 'Lorem ipsum',
    value: '13.05.2024',
  },
  dividendOnStock: {
    label: 'Дивиденд на акцию',
    tooltip: 'Lorem ipsum',
    value: '50 ₽',
  },
  dividendProfitability: {
    label: 'Дивидендная доходность',
    tooltip: 'Lorem ipsum',
    value: '0.14%',
  },
};

const DividendPaymentDate = () => {
  return (
    <Paper className='!px-0'>
      <h2 className='text-h4 mx-6'>Дата выплаты дивидендов</h2>

      <ul className='border-t-2 border-blackedGray mt-4'>
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
