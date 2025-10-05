import { FC, ReactNode } from 'react';
import { cn } from '@/utilts/cn';
import Paper from '../ui/Paper/Paper';
import Button from '../ui/Button/Button';
import Image from 'next/image';
import CoinMarketCap from '@/assets/mock-avatars/CoinMarketCap.png';
import JohnSmith from '@/assets/mock-avatars/LikeJohnSmith.jpg';
import VasyTerkina from '@/assets/mock-avatars/LikeVasyTerkina.jpg';
import WhaleAlert from '@/assets/mock-avatars/LikeWhaleAlert.jpg';
import Check from '@/assets/system-icons/check.svg';

const suggestionsList = [
  { id: 1, img: CoinMarketCap, title: 'CoinMarketCap', nickname: '@CoinMarketCap' },
  { id: 2, img: WhaleAlert, title: 'WhaleAlert', nickname: '@whale_alert' },
  { id: 3, img: JohnSmith, title: 'John Smith', nickname: '@jhonny_rico' },
  { id: 4, img: VasyTerkina, title: 'Vasya Terkina', nickname: '@vasilisa_terkina' },
];

interface SuggestionCardProps {
  className?: string;
  children?: ReactNode;
}

const SuggestionCard: FC<SuggestionCardProps> = ({ className, children }) => {
  return (
    <Paper
      className={cn(
        className,
        'flex flex-col gap-3 p-4 rounded-[24px] border border-regaliaPurple backdrop-blur-[100px]',
      )}
    >
      <div className='flex justify-between items-center'>
        <span className='text-white text-[24px] font-bold'>You might like</span>
        <div className='text-[15px] font-bold text-lightPurple'>Show more &gt;</div>
      </div>
      <div className='border-t border-regaliaPurple opacity-40'></div>

      <div className='flex flex-col gap-[24px] mt-2'>
        {suggestionsList.map((suggestion) => {
          return (
            <div key={suggestion.id} className='flex items-center justify-between'>
              <div className='flex items-center justify-start'>
                <Image
                  src={suggestion.img}
                  alt='Product Photo'
                  className='w-[44px] h-[44px] rounded-full overflow-hidden object-cover mr-2'
                  priority
                />
                <div className='flex flex-col'>
                  <span className='flex items-center text-white text-[15px] font-bold'>
                    {suggestion.title} <Check className='ml-1' />
                  </span>
                  <span className='text-lighterAluminum text-[12px] font-bold'>
                    {suggestion.nickname}
                  </span>
                </div>
              </div>
              <Button variant={'primary'} className='w-[80px] h-[32px] text-xs'>
                <div>Follow</div>
              </Button>
            </div>
          );
        })}
      </div>
      {children}
    </Paper>
  );
};

export default SuggestionCard;
