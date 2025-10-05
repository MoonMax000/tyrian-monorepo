import Paper from '@/components/Paper';
import IconInfoCirle from '@/assets/icons/info-circle.svg';
import { Tooltip } from 'react-tooltip';

const mockData = {
  rate: {
    label: 'Коэффициент выплат дивидендов',
    tooltip: 'Lorem ipsum',
    value: '15%',
  },
  frequencyOfPayments: {
    label: 'Частота выплат дивидендов',
    tooltip: 'Lorem ipsum',
    value: '4',
  },
  yearsCountOfPayment: {
    label: 'Количество лет выплаты дивидендов, лет',
    tooltip: 'Lorem ipsum',
    value: '3',
  },
  growthRates: {
    label: 'Темпы роста дивидендов за 5 лет',
    tooltip: 'Lorem ipsum',
    value: '6.3%',
  },
  dividendIncreasesOfFiveYears: {
    label: 'Рост дивидендов за 5 лет',
    tooltip: 'Lorem ipsum',
    value: '35.71%',
  },
  stabilityIndex: {
    label: 'Индекс стабильности дивидендов',
    tooltip: 'Lorem ipsum',
    value: '0.57',
  },
};

const DividendMetrics = () => {
  return (
    <Paper className='!px-0'>
      <h2 className='text-h4 mx-6'>Дивидендные метрики</h2>

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

export default DividendMetrics;
