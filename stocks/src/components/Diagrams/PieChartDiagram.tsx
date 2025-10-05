import { FC } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
export interface IDataEL {
  color: string;
  name: string;
  value: number;
}
interface PieChartDiagramProps {
  data: IDataEL[];
  width?: number;
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  className?: string;
  legentTitle?: string;
}

const PieChartDiagram: FC<PieChartDiagramProps> = ({
  data,
  width,
  height,
  className,
  innerRadius = 110,
  outerRadius = 170,
  legentTitle,
}) => {
  return (
    <ResponsiveContainer width='100%' height='100%' className={className}>
      <div className='flex gap-8 items-center'>
        <div className='flex items-center justify-center'>
          <PieChart width={width} height={height}>
            <Pie
              data={data}
              dataKey='value'
              cx='50%'
              cy='50%'
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              fill='#8884d8'
            >
              {data.map((entry) => (
                <Cell key={`cell-${entry.name}-${entry.value}`} fill={entry.color} stroke='none' />
              ))}
            </Pie>
          </PieChart>
        </div>
        <div>
          {legentTitle && <p className='mt-3 mb-4'>{legentTitle}</p>}

          <ul className='flex flex-col gap-3'>
            {data.map((item, index) => (
              <li key={`${item.value}-${index}`} className='flex items-center gap-3'>
                <span
                  style={{ backgroundColor: item.color }}
                  className='size-3 min-w-3 min-h-3 block rounded-[50%]'
                />
                <p className='text-body-15'>{item.name}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ResponsiveContainer>
  );
};

export default PieChartDiagram;
