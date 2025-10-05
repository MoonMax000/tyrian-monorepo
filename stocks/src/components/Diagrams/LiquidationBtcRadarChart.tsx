import { FC } from 'react';
import { RadarChart, Radar, ResponsiveContainer } from 'recharts';

export interface DataPoint {
  category: string;
  value: number;
  color: string;
}

interface IProps {
  data: DataPoint[];
  className?: string;
  r1?: number;
  r2?: number;
}

const LiquidationBtcRadarChart: FC<IProps> = ({ data, className, r1 = 85, r2 = 45 }) => {
  const colors = data.map((el) => el.color);
  return (
    <div className={className}>
      <ResponsiveContainer width='100%' height='100%'>
        <RadarChart cx='50%' cy='50%' outerRadius='80%' data={data}>
          <circle r={r1} cx='50%' cy='50%' fill='transparent' stroke='#2E2744' strokeWidth={20} />{' '}
          <circle r={r2} cx='50%' cy='50%' fill='transparent' stroke='#2E2744' strokeWidth={20} />{' '}
          <circle r={20} cx='50%' cy='50%' fill='#2E2744' />
          <Radar
            name='Показатели'
            dataKey='value'
            stroke='#8B5CF6'
            fillOpacity={15}
            strokeWidth={15}
            fill='#8B5CF6'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          {data.map((entry, index) => {
            const angle = -Math.PI / 2 + (index * 2 * Math.PI) / data.length;
            const radius = 40;
            const offset = 8;
            const offsetPercent = (offset / Math.min(306, 286)) * 100;
            const totalRadius = radius + offsetPercent;

            return (
              <circle
                key={`point-${index}`}
                cx={`${50 + (totalRadius + 4) * Math.cos(angle)}%`}
                cy={`${50 + (totalRadius + 4) * Math.sin(angle)}%`}
                r={6}
                fill={colors[index]}
              />
            );
          })}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LiquidationBtcRadarChart;
