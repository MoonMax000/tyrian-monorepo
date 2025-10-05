import type { FC, ReactNode } from 'react';
import clsx from 'clsx';
import QuestionIcon from '@/assets/icons/question.svg';
import ContentWrapper from '../ContentWrapper';

interface ICardWithDetailsProps {
  title: string;
  children: ReactNode;
  onClick: () => void;
  className?: string;
}

const CardWithDetails: FC<ICardWithDetailsProps> = ({ title, children, onClick, className }) => {
  return (
    <ContentWrapper className={clsx(className, 'p-4 flex flex-col gap-y-4')}>
      <div className='flex items-center gap-x-[6px]'>
        <span className='text-grayLight text-[12px] font-bold uppercase'>{title}</span>
        <button onClick={onClick} className='text-grayLight hover:text-white'>
          <QuestionIcon width={16} height={16} />
        </button>
      </div>
      <div className='mt-auto'>{children}</div>
    </ContentWrapper>
  );
};

export default CardWithDetails;
