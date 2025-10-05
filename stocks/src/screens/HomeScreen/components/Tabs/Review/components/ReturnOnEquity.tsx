import LineDiagram, { LineConfig } from '@/components/Diagrams/LineDiagram';
import ContentWrapper from '@/components/UI/ContentWrapper';
import { FC } from 'react';
import LegendIcon from '@/assets/icons/circleWithLine.svg';
import QuestionIcon from '@/assets/icons/question.svg';
import DiagramNotificationEl from '@/components/Diagrams/DiagramNotificationEl/DiagramNotificationEl';

const ReturnOnEquity: FC = () => {
  const serverData = {
    line1: [
      { value: 72, datetime: '2023-03-20T09:00:00' },
      { value: 60, datetime: '2022-03-20T12:00:00' },
      { value: 48, datetime: '2022-03-20T15:00:00' },
      { value: 36, datetime: '2022-03-20T18:00:00' },
      { value: 24, datetime: '2021-03-20T18:00:00' },
    ],
    line2: [
      { value: 70, datetime: '2023-03-20T09:00:00' },
      { value: 62, datetime: '2022-03-20T12:00:00' },
      { value: 50, datetime: '2022-03-20T15:00:00' },
      { value: 38, datetime: '2022-03-20T18:00:00' },
      { value: 26, datetime: '2021-03-20T18:00:00' },
    ],
  };

  const lineConfigs: { [key: string]: LineConfig } = {
    line1: {
      color: '#6AA6FF',
      dotColor: '#6AA6FF',
    },
    line2: {
      dotColor: '#FFA800',
      color: '#FFA800',
      isDashed: true,
    },
  };

  const legnd = [
    { color: '#6AA6FF', title: 'Current company', procent: 137.2 },
    { color: '#FFA800', title: 'Current industry', procent: -133.2 },
  ];

  const yTickFormatter = (value: number): string => {
    return `${value}%`;
  };

  return (
    <ContentWrapper className='py-6 px-4'>
      <div className='flex items-center gap-[6px]'>
        <h2 className='text-[24px] font-bold text-white'>Return on Capital (ROC)</h2>
        <button className='text-grayLight hover:text-white'>
          <QuestionIcon width={20} height={20} />
        </button>
      </div>
      <LineDiagram
        height={245}
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
            key={'on-capital-color-' + el.color}
            className='items-strart justify-between flex gap-[7px] font-bold'
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
        message='XXXX has become more efficient at generating Return on Captal (N%) compared to three years ago (N%)'
        label='Growing ratio'
        signal='good'
      />
    </ContentWrapper>
  );
};

export default ReturnOnEquity;
