import AcceptedIcon from '@/assets/icons/accepted.svg';
import Image from 'next/image';
import CommentIcon from '@/assets/comment.svg';
import ShareIcon from '@/assets/share.svg';
import HandImg from '../../../public/hand.png';
import AvatarImg from '../../../public/avatar.png';

export const SocialNetworkCard = () => {
  return (
    <div className='flex h-fit backdrop-blur-[100px] border border-regaliaPurple rounded-2xl overflow-hidden'>
      <Image
        src={HandImg}
        alt='hand'
        width={237}
        height={180}
        placeholder='blur'
        loading='lazy'
        className='object-cover object-center'
      />
      <div className='flex flex-col gap-3 p-4'>
        <span className='text-[15px] font-bold'>
          Ethereum Breaks $2,200 Resistance Level as Shanghai Upgrade Approaches
        </span>
        <span className='text-[15px] font-medium text-textGray'>
          Ethereum has successfully broken through the critical $2,200 resistance level, ...
        </span>
        <div className='flex justify-between'>
          <div className='flex gap-2'>
            <Image
              src={AvatarImg}
              alt='avatar'
              width={44}
              height={44}
              placeholder='blur'
              loading='lazy'
              className='object-cover object-center rounded-full'
            />
            <div className='flex flex-col'>
              <span className='flex gap-1 text-[15px] text-white font-bold'>
                John Smith
                <AcceptedIcon />
              </span>
              <span className='text-[12px] text-textGray'>January 31, 5:10 PM</span>
            </div>
          </div>
          <div className='flex gap-4'>
            <span className='flex gap-[6px] items-center text-[12px] font-bold text-textGray'>
              <CommentIcon />
              17
            </span>
            <span className='flex gap-[6px] items-center text-[12px] font-bold text-textGray'>
              <ShareIcon />
              17
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
