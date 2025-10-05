import Image from 'next/image';
import LikeIcon from '@/assets/like.svg';
import CommentIcon from '@/assets/big-comment.svg';
import ShareIcon from '@/assets/big-share.svg';
import Button from '@/components/UI/Button';
import { ViewAll } from '@/components/UI/ViewAll/ViewAll';
import { liveNewsButtons } from './mockData';

export const LiveNewsContent = () => {
  return (
    <div className='flex'>
      <div className='flex flex-col w-[50%] justify-between h-[388px] py-4 px-6 relative'>
        <Image
          className='absolute z-[-1] top-0 max-h-[387px] left-0'
          src='/rectangle-full.png'
          alt='rect'
          width={754}
          height={387}
        />
        <span className='text-[24px] font-bold'>The Future of Crypto-currency Trading</span>
        <div className='flex flex-col gap-[10px]'>
          <div className='text-[15px] font-medium'>
            In recent years, artificial intelligence (AI) has become an integral part of the global
            economy. However, its impact on emerging economies raises serious concerns. Automated
            systems and algorithms, designed to improve efficiency, are beginning to replace
            traditional jobs—leaving millions without a source of income. In regions already
            struggling with economic instability, the rise of AI only deepens existing issues of
            inequality and poverty.
          </div>
          <span className='underline text-[15px] font-bold'>Read more...</span>

          <div className='flex w-full justify-between'>
            <span className='text-[12px] font-bold'>January 31, 5:10 PM</span>
            <div className='flex gap-6'>
              <span className='flex items-center gap-[6px] text-[12px] font-extrabold'>
                <LikeIcon />
                1.5K
              </span>
              <span className='flex items-center gap-[6px] text-[12px] font-extrabold'>
                <CommentIcon />
                1.5K
              </span>
              <span className='flex items-center gap-[6px] text-[12px] font-extrabold'>
                <ShareIcon />
                1.5K
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className='flex flex-col w-[50%] p-4 gap-4 border border-regaliaPurple rounded-tr-2xl rounded-br-2xl'>
        <div className='flex justify-between'>
          <div className='flex gap-3'>
            {liveNewsButtons.map((item) => (
              <Button
                key={item.name}
                style={{
                  padding: '10px 8px',
                  background: !!item.isActive
                    ? 'linear-gradient(270deg, #A06AFF 0%, #482090 100%)'
                    : 'none',
                }}
                className='flex items-center justify-center w-fit h-[40px] rounded-lg gap-[10px] py-[10px] px-[8px]  border border-regaliaPurple'
              >
                {item.name}
              </Button>
            ))}
          </div>
          <ViewAll children='All News' className='underline' />
        </div>
        <div className='flex flex-col justify-between h-full'>
          {Array.from([0, 1, 2, 3, 4], () => (
            <div
              key={Math.random()}
              className='w-full flex flex-col justify-between border-b-[1px] border-regaliaPurple pb-1'
            >
              <span className='text-[12px] font-bold text-textGray'>January 31, 5:10 PM</span>
              <span className='text-[15px] font-bold text-white'>
                The Future of Crypto-currency Trading
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
