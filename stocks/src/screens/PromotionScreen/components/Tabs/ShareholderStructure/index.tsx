'use client';

import Paper from '@/components/Paper';
import { mockGraphicData } from '../Review/constants';
import PieChartDiagram from '@/components/Diagrams/PieChartDiagram';
const ShareholderStructure = () => {
  return (
    <Paper>
      <h3 className='text-h4 mb-6'>Структура акционеров</h3>

      <PieChartDiagram data={mockGraphicData} width={360} height={360} legentTitle='Топ-5' />
    </Paper>
  );
};

export default ShareholderStructure;
