import Image from 'next/image';

interface VideoItemProps {
  className?: string;
  src: string;
  timeSpan: string;
}

export const VideoItem = ({ className, src, timeSpan }: VideoItemProps) => {
  return (
    <>
      <Image className={className} objectFit='cover' src={src} fill alt='' />
      <div className='absolute right-1 bottom-1 bg-[#0B0E11A3] rounded p-1'>{timeSpan}</div>
    </>
  );
};

export default VideoItem;
