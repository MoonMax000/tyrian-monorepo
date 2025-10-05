import type { FC } from 'react';
import clsx from 'clsx';
import { Tooltip } from 'react-tooltip';
import ContentWrapper from '../ContentWrapper';
import QuestionIcon from '@/assets/icons/question.svg';

export type AttributeColumnItem = {
  label: string;
  value: string;
  tooltip: string;
};

interface AttributeColumnCardProps {
  title: string;
  items: AttributeColumnItem[];
  className?: string;
}

const AttributeColumnCard: FC<AttributeColumnCardProps> = ({ title, items, className }) => {
  return (
    <ContentWrapper className={clsx('py-6', className)}>
      <div className='pb-4 border-b-[1px] border-gunpowder px-4'>
        <h2 className='font-bold text-[24px] text-white'>{title}</h2>
      </div>
      <ul className='flex flex-col gap-y-[18px] px-4 mt-4'>
        {items.map(({ label, value, tooltip }) => (
          <li key={label} className='flex items-center justify-between text-[15px] font-bold'>
            <div className='flex items-center gap-x-1'>
              <span className='text-grayLight'>{label}</span>
              <QuestionIcon
                width={16}
                height={16}
                data-tooltip-id={label}
                data-tooltip-content={tooltip}
              />
              <Tooltip id={label} />
            </div>
            <span className='text-white'>{value}</span>
          </li>
        ))}
      </ul>
    </ContentWrapper>
  );
};

export default AttributeColumnCard;
