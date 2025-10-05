import { videos } from '@/app/data';
import VideoItem from './VideoItem';

const DetailsVideos = () => {
  return (
    <div>
      <div className='grid place-items-center h-[76px] border-b border-onyxGrey'>
        <span className='text-[17px]'>Видео</span>
      </div>
      <div className='ml-5 my-4 opacity-[48%] text-[15px]'>Февраль</div>
      <div className='grid grid-cols-3 gap-1 px-1'>
        {videos.map((video, index) => (
          <div className='size-32 relative rounded-lg overflow-hidden' key={index}>
            <VideoItem src={video.link} timeSpan={video.timeSpan} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetailsVideos;