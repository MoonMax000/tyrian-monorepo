import NextImage from 'next/image';
import { photoLinks } from '@/app/data';

const DetailsPhotos = () => {
  return (
    <div>
      <div className='grid place-items-center h-[76px] border-b border-onyxGrey'>
        <span className='text-[17px]'>Фото</span>
      </div>
      <div className='ml-5 my-4 opacity-[48%] text-[15px]'>Февраль</div>
      <div className='grid grid-cols-3 gap-1'>
        {photoLinks.map((photoLink, index) => (
          <div className='size-32 relative rounded-lg overflow-hidden' key={index}>
            <NextImage src={photoLink} fill alt='' />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetailsPhotos;