import type { FC } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import AccordionItem, { AccordionItemModel } from '@/components/UI/AccordionItem';

interface IFAQProps {
  items: AccordionItemModel[];
  className?: string;
}

export const FAQ: FC<IFAQProps> = ({ items, className }) => (
  <div className={className}>
    <div>
      <h1 className='text-[56px] font-bold text-white'>FAQ</h1>
      <p className='text-grayLight inline-block max-w-[640px] mt-4'>
        We've compiled answers to the most common questions about our affiliate program. If you have
        additional questions, please contact our{' '}
        <Link className='text-white hover:underline' href='/support'>
          support team
        </Link>
        .
      </p>
    </div>
    <div className='flex flex-col gap-y-8 mt-12'>
      {items.map((item) => (
        <AccordionItem item={item} key={item.title} />
      ))}
    </div>
  </div>
);
