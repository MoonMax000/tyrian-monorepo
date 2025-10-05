import type { FC } from 'react';

import Paper from '@/components/UI/Paper';
import VideoPreview from '@/components/UI/VideoPreview';

type VideoItem = {
  src: string;
  mainOffice: string;
  additionalLocations: string[];
};

interface IVideoProps {
  video: VideoItem;
}

export const Video: FC<IVideoProps> = ({ video }) => {
  const { src, mainOffice, additionalLocations } = video;

  return (
    <Paper className='p-4 flex flex-col gap-y-4'>
      <div>
        <h3 className='text-[19px] font-bold text-purple'>Video:</h3>
        <VideoPreview src={src} className='mt-4 rounded-[8px] overflow-hidden' />
      </div>
      <div className='text-[15px] font-medium'>
        <h3 className='text-[19px] font-bold text-purple mb-4'>Location:</h3>
        <div className='flex flex-col'>
          <span>Main Office: {mainOffice}</span>
          <span>Additional Locations: {additionalLocations.join(', ')}</span>
        </div>
      </div>
    </Paper>
  );
};
