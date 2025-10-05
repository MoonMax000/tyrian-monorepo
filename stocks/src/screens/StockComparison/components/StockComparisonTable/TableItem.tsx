'use client';

import { FC, useState } from 'react';
import IconChevronDown from '@/assets/icons/chevron-down.svg';
import clsx from 'clsx';
import TableItemGraphic from './TableItemGraphic';

interface TableItemProps {
  headings: { name: string; key: string }[];
  data: {
    heading: string;
    nvidia: string;
    apple: string;
  };
  withGraphic?: boolean;
}

const TableItem: FC<TableItemProps> = ({ headings, data, withGraphic }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <li className='even:bg-moonlessNight'>
      <div className='grid grid-cols-[repeat(5,1fr)] gap-6 items-center justify-between p-6'>
        {headings.map((head, itemRowIndex) => {
          return (
            <div
              key={`${itemRowIndex}-${head.key}`}
              className={clsx({
                'flex items-center gap-1': withGraphic && head.key === 'heading',
              })}
            >
              <p className='text-body-15'>
                {head.key in data ? data[head.key as keyof typeof data] : '--'}
              </p>
              {withGraphic && head.key === 'heading' && (
                <button
                  type='button'
                  onClick={() => setIsOpen((prev) => !prev)}
                  className={clsx('transition-transform', {
                    'rotate-180': isOpen,
                  })}
                >
                  <IconChevronDown />
                </button>
              )}
            </div>
          );
        })}
      </div>

      <TableItemGraphic isOpen={isOpen} />
    </li>
  );
};

export default TableItem;
