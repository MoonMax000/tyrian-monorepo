import AccordionItem, { AccordionItemModel } from '@/components/UI/AccordionItem';
import { FC } from 'react';

const questions: AccordionItemModel[] = [
  {
    title: 'How can I become a partner?',
    content:
      'A dividend calendar is a schedule or, in other words, a schedule for the payment of dividends. The calendar of dividend shares contains: the amount of the dividend, the payment period, the dividend yield, and the closing date of the register (cut-off date).',
  },
  {
    title: 'What percentage will I receive for each referred client?',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor.',
  },
  {
    title: 'How often are payouts made?',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce velit tortor, dictum eu felis vel, malesuada efficitur ipsum. Aenean placerat elit nec nibh ultrices, sit amet gravida nisl lobortis.',
  },
];

interface Props {
  className?: string;
}

const FaqBlock: FC<Props> = ({ className }) => {
  return (
    <div className={className}>
      <h3 className='text-[56px] font-bold'>FAQ</h3>
      <p className='mt-4 p text-body-15 text-webGray'>
        We&apos;ve compiled answers to the most common questions about Sberbank. If you have <br />
        additional inquiries, please contact our{' '}
        <span className='underline underline-offset-2 text-white'>support team</span>.
      </p>
      <div className='flex flex-col gap-2 mt-[48px]'>
        {questions.map((question, index) => (
          <AccordionItem
            className='border hover:border-regaliaPurple border-transparent !rounded-3xl !bg-transparent hover:!backdrop-blur-[100px]'
            key={index}
            item={question}
          />
        ))}
      </div>
    </div>
  );
};

export default FaqBlock;
