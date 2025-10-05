import type { FC } from 'react';

import Slider, { type Slide } from '@/components/UI/Slider';
import DescriptionCard from '@/components/UI/DescriptionCard';

import { cn } from '@/utils/cn';

interface IScriptSliderProps {
  slides: Slide[];
}

export const ScriptSlider: FC<IScriptSliderProps> = ({ slides }) => (
  <DescriptionCard title='Description'>
    <div className={cn('text-body-15')}>
      <Slider showDots={false} className='w-[680px] h-[357px]' showCount={false} slides={slides} />
    </div>
  </DescriptionCard>
);
