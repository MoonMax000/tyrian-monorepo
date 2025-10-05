import Link from 'next/link';
import Image from 'next/image';
import ContentWrapper from '@/components/UI/ContentWrapper';
import ChevronRight from '@/assets/icons/chevron-right.svg';
import explosureType from '@/assets/explosure.png';
import worldMap from '@/assets/world-map.png';

export const EtfAnalysis = ({ shortName }: { shortName: string }) => {
  return (
    <ContentWrapper className='mt-6'>
      <div className='border-b-[1px] border-b-regaliaPurple px-4 py-6'>
        <Link
          className='text-[24px] font-bold text-purple flex items-center gap-x-2 hover:underline'
          href={`${shortName}/analysis`}
        >
          <span>{shortName} analysis</span>
          <ChevronRight />
        </Link>
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-2 pt-6 pb-[10px] px-4 gap-[27px]'>
        <div className='border-r-[2px] border-gunpowder'>
          <h4 className='text-[19px] text-white font-bold mb-6'>What's in the fund</h4>
          <div className='flex items-center justify-center'>
            <Image src={explosureType} alt='explosure type' className='max-w-full object-cover' />
          </div>
        </div>
        <div>
          <h4 className='text-[19px] text-white font-bold mb-6'>Stock breakdown by region</h4>
          <div className='flex items-center justify-center'>
            <Image src={worldMap} alt='World map' className='max-w-full object-cover' />
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
};
