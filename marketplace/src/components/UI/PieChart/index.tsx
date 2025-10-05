'use client';
import { FC } from 'react';
import { Cell, Pie, PieChart } from 'recharts';

interface Props {
  data: { name: string; value: number; color: string }[];
  width?: number;
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
}

export const ChartPie: FC<Props> = ({ data, width, height, innerRadius, outerRadius }) => {
  return (
    <PieChart width={width ? width : 190} height={height ? height : 190}>
      <Pie
        data={data}
        innerRadius={innerRadius ? innerRadius : 60}
        outerRadius={outerRadius ? outerRadius : 80}
        fill='#8884d8'
        paddingAngle={0}
        dataKey='value'
        stroke='none'
      >
        {data.map((entry) => (
          <Cell key={`cell-${entry.name}`} fill={entry.color} />
        ))}
      </Pie>
    </PieChart>
  );
};
