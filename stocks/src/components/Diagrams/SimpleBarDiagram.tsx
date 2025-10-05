import { FC } from 'react';
import { Bar, BarChart } from 'recharts';

interface SimpleBarDiagramProps {
  data: { name: string; pv: number }[];
  width?: number;
  height?: number;
}
const SimpleBarDiagram: FC<SimpleBarDiagramProps> = ({ data, width = 100, height = 100 }) => {
  return (
    <BarChart data={data} width={width} height={height} margin={{ right: -1, left: -1, top: -5 }}>
      <Bar dataKey='pv' fill='#A06AFF' barSize={4} />
    </BarChart>
  );
};

export default SimpleBarDiagram;
