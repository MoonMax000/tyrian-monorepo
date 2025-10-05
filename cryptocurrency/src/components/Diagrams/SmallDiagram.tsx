import React, { FC } from 'react';
import { LineChart, Line, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface SmallDiagramProps {
  className?: string;
  low?: boolean;
}

const SmallDiagram: FC<SmallDiagramProps> = ({ className, low }) => {
  const data = [
    { y: 6 },
    { y: 8 },
    { y: 6 },
    { y: 8 },
    { y: 8 },
    { y: 12 },
    { y: 9 },
    { y: 11 },
    { y: 1 },
    { y: 2 },
    { y: 9 },
    { y: 9.5 },
    { y: 10 },
    { y: 12 },
    { y: 10 },
    { y: 12 },
  ];

  const color = low ? '#EF454A' : '#2EBD85';

  return (
    <div className={`h-[32px] bg-transparent ${className}`}>
      <ResponsiveContainer width='100%' height='100%'>
        <LineChart margin={{ top: 3, right: 5, left: 5, bottom: 3 }}>
          <Line
            type='linear'
            dataKey='y'
            data={data}
            stroke={color}
            strokeWidth={2}
            dot={false}
            style={{ filter: `drop-shadow(0px 0px 6px ${color})` }}
          />
        </LineChart>
      </ResponsiveContainer>

      <ResponsiveContainer width='100%' height='100%' style={{ position: 'absolute', top: 8 }}>
        <AreaChart data={data} margin={{ top: 0, right: 5, left: 5, bottom: 5 }}>
          <defs>
            <linearGradient
              id={`areaGradient-${low ? 'low' : 'default'}`}
              x1='0'
              y1='0'
              x2='0'
              y2='1'
            >
              <stop offset='0%' stopColor={color} stopOpacity={0.6} />
              <stop offset='100%' stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>

          <Area
            type='monotone'
            dataKey='y'
            stroke={color}
            fill={`url(#areaGradient-${low ? 'low' : 'default'})`}
            strokeWidth={0}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SmallDiagram;
