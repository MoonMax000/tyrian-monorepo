import LineDiagram, { LineConfig } from '@/components/Diagrams/LineDiagram';
import ContentWrapper from '@/components/UI/ContentWrapper';
import { FC } from 'react';
import LegendIcon from '@/assets/icons/circleWithLine.svg';
import QuestionIcon from '@/assets/icons/question.svg';
import DiagramNotificationEl from '@/components/Diagrams/DiagramNotificationEl/DiagramNotificationEl';
import { useQuery } from '@tanstack/react-query';
import { StocksService } from '@/services/StocksService';
import { useParams } from 'next/navigation';

const ROE: FC = () => {
  const { stockName } = useParams<{ stockName: string }>();
  const serverData = {
    line1: [
      { value: 100, datetime: '2023-03-20T09:00:00' },
      { value: 110, datetime: '2018-03-20T12:00:00' },
      { value: 130, datetime: '2017-03-20T15:00:00' },
      { value: 150, datetime: '2016-03-20T18:00:00' },
      { value: 100, datetime: '2015-03-21T09:00:00' },
    ],
    line2: [
      { value: -100, datetime: '2023-03-20T09:00:00' },
      { value: -110, datetime: '2018-03-20T12:00:00' },
      { value: -130, datetime: '2017-03-20T15:00:00' },
      { value: -150, datetime: '2016-03-20T18:00:00' },
      { value: -100, datetime: '2015-03-21T09:00:00' },
    ],
    line3: [
      { value: 90, datetime: '2023-03-20T09:00:00' },
      { value: 60, datetime: '2018-03-20T12:00:00' },
      { value: 70, datetime: '2017-03-20T15:00:00' },
      { value: 80, datetime: '2016-03-20T18:00:00' },
      { value: 30, datetime: '2015-03-21T09:00:00' },
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
    { color: '#A06AFF', title: 'current company', procent: 137.2 },
    { color: '#FFA800', title: 'current undustry', procent: -133.2 },
    { color: '#6AA5FF', title: 'current market', procent: 138.2 },
  ];

  const yTickFormatter = (value: number): string => {
    return `${value.toFixed(0)}%`;
  };

  const { data: roeData } = useQuery({
    queryKey: ['roe'],
    queryFn: () => StocksService.roe('us', stockName),
  });

  //

  return (
    <ContentWrapper className='py-6 px-4'>
      <div className='flex items-center gap-[6px]'>
        <h2 className='text-[24px] font-bold text-white'>Return on Equity (ROE)</h2>
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
      />
      <div className='flex items-center justify-center gap-4 mt-4'>
        {legnd.map((el) => (
          <div key={el.color} className='items-strart justify-between flex gap-[7px] font-semibold'>
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
        message='Return on Equity (ROE) XXXX (N%) indicates that the compaby converts shareholders’ equity into profit very effuciently'
        label='High ratio'
        signal='good'
      />
    </ContentWrapper>
  );
};

export default ROE;
