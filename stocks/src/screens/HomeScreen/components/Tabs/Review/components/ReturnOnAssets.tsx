import LineDiagram, { LineConfig } from '@/components/Diagrams/LineDiagram';
import ContentWrapper from '@/components/UI/ContentWrapper';
import { FC } from 'react';
import LegendIcon from '@/assets/icons/circleWithLine.svg';
import QuestionIcon from '@/assets/icons/icon-question-wavy-border.svg';
import DiagramNotificationEl from '@/components/Diagrams/DiagramNotificationEl/DiagramNotificationEl';

const ReturnOnAssets: FC = () => {
  const serverData = {
    line1: [
      { value: 24.5, datetime: '2023-03-20T09:00:00' },
      { value: 27.3, datetime: '2018-03-20T12:00:00' },
      { value: 26, datetime: '2017-03-20T15:00:00' },
      { value: 25.5, datetime: '2016-03-20T18:00:00' },
      { value: 24.5, datetime: '2016-03-20T18:00:00' },
    ],
    line2: [
      { value: 25.2, datetime: '2023-03-20T09:00:00' },
      { value: 27.3, datetime: '2018-03-20T12:00:00' },
      { value: 27, datetime: '2017-03-20T15:00:00' },
      { value: 25.5, datetime: '2016-03-20T18:00:00' },
    ],
  };

  const lineConfigs: { [key: string]: LineConfig } = {
    line1: {
      color: '#A06AFF',
      dotColor: '#A06AFF',
    },
    line2: {
      dotColor: '#FFA800',
      color: '#FFA800',
      isDashed: true,
    },
    line3: {
      dotColor: '#6AA5FF',
      color: '#6AA5FF',
      isDashed: true,
    },
  };

  const legnd = [
    { color: '#A06AFF', title: 'Current company', procent: 137.2 },
    { color: '#FFA800', title: 'Current industry', procent: -133.2 },
  ];

  const yTickFormatter = (value: number): string => {
    return `${value}%`;
  };

  return (
    <ContentWrapper className='px-4 py-6'>
      <div className='flex items-center gap-[6px]'>
        <h2 className='text-[24px] font-bold text-white'>Return on Assets (ROA)</h2>
        <button className='text-grayLight hover:text-white'>
          <QuestionIcon width={20} height={20} />
        </button>
      </div>
      <LineDiagram
        height={293}
        width='100%'
        className='mt-6'
        serverData={serverData}
        lineConfigs={lineConfigs}
        yTickFormatter={yTickFormatter}
        yCustom={true}
      />
      <div className='flex items-center justify-center gap-4 mt-4'>
        {legnd.map((el) => (
          <div
            key={'on-assets' + el.color}
            className='items-strart justify-between flex gap-[7px] font-semibold'
          >
            <div className='pt-[4px]'>
              <LegendIcon color={el.color} width={14} height={8} />
            </div>
            <div>
              <p className='uppercase text-[12px] text-grayLight font-bold'>{el.title}</p>
              <span className='text-[15px] font-bold text-white'>{el.procent}%</span>
            </div>
          </div>
        ))}
      </div>

      <DiagramNotificationEl
        classname='mt-6'
        message='XXXX generates higher Return on Assets (N%) than the consumer electornics industry average in N-sk (N%).'
        label='Above-average ratio'
        signal='good'
      />
    </ContentWrapper>
  );
};

export default ReturnOnAssets;
