import type { FC } from 'react';

import DescriptionCard from '@/components/UI/DescriptionCard';
import Expandable from '@/components/UI/Expandable';

interface IRobotDescriptionProps {
  robotName: string;
  description: string;
}

export const RobotDescription: FC<IRobotDescriptionProps> = ({ robotName, description }) => (
  <DescriptionCard title={robotName}>
    <Expandable collapsedHeight={80}>
      <p className='text-[15px] font-medium'>{description}</p>
    </Expandable>
  </DescriptionCard>
);
