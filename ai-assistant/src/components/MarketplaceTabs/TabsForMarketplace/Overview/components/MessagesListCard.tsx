import { FC, ReactNode } from 'react';
import ArrowButton from '@/assets/Navbar/ArrowButton.svg';
import JhonIcon from '@/assets/mock-avatars/jhondoe.png';
import JaneIcon from '@/assets/mock-avatars/jane.png';
import SophiaLight from '@/assets/mock-avatars/SophiaLight.jpg';
import Image from 'next/image';
import Button from '@/components/ui/Button/Button';
import { IndicatorTag } from '@/components/ui/IndicatorTag/IndicatorTag';
import Counter from '@/components/ui/Counter/Counter';

const socialNetworkList = [
  {
    id: 2,
    img: SophiaLight,
    title: 'Sophia Light',
    comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    count: 1,
  },
  {
    id: 3,
    img: JaneIcon,
    title: 'Jane Doe',
    comment:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus consect Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus consect',
    count: 17,
  },
  {
    id: 1,
    img: JhonIcon,
    title: 'Jhon Doe',
    comment: 'Lorem ipsum dolor sit amet.',
    count: 8,
  },
];

interface SocialNetworkCardProps {
  children?: ReactNode;
}

const MessagesListCard: FC<SocialNetworkCardProps> = ({ children }) => {
  return (
    <div
      className={'container-card p-4 rounded-[24px] gap-[16px] max-w-[100%]'}
    >
      <div className='flex flex-col h-full gap-[21px]'>
        <div className='flex-1 flex flex-col justify-start  overflow-hidden'>
          <div className='flex items-center justify-between'>
            <div className='text-white font-bold text-[24px]'>
              Marketplace messages
            </div>
            <IndicatorTag
              type='purple'
              className='h-fit flex items-center text-[12px] font-bold py-[2px] px-[4px]'
            >
              26 new messages
            </IndicatorTag>
          </div>
        </div>
        <div className='flex flex-col gap-[16px]'>
          {socialNetworkList.map(({ id, img, title, comment, count }) => {
            return (
              <div key={id} className='flex items-center justify-between gap-2'>
                <div className='flex items-center justify-start flex-1 min-w-0'>
                  <Image
                    src={img}
                    alt='Chat Photo'
                    className='w-[44px] h-[44px] rounded-[50px] object-cover mr-2'
                    priority
                  />
                  <div className='flex flex-col flex-1 min-w-0'>
                    <span className='text-lightPurple text-[15px] font-bold'>
                      {title}
                    </span>
                    <span className='text-lighterAluminum text-[15px] font-[500] truncate'>
                      {comment}
                    </span>
                  </div>
                </div>
                <Counter value={count} />
              </div>
            );
          })}
        </div>
        <Button className='text-white text-[15px] font-bold gap-[4px] px-[16px] h-[26px]'>
          Open Chat
        </Button>
      </div>
      {children}
    </div>
  );
};

export default MessagesListCard;
