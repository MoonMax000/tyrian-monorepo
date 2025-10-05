import type { FC } from 'react';

import Paper from '@/components/UI/Paper';
import Slider, { type Slide } from '@/components/UI/Slider';

interface IOtherSliderProps {
  slides: Slide[];
}

export const OtherSlider: FC<IOtherSliderProps> = ({ slides }) => {
  return (
    <Paper className='p-4'>
      <Slider
        showDots={false}
        className='w-full'
        showCount={false}
        slides={slides}
        sliderButtonsVariant='top'
      />
    </Paper>
  );
};
