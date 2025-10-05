import type { FC } from 'react';
import Link from 'next/link';
import AccordionItem, { AccordionItemModel } from '@/components/UI/AccordionItem';

interface IFAQProps {
  items?: AccordionItemModel[];
  className?: string;
}

const FAQItems = [
  {
    title: 'How can I become a partner?',
    content:
      "To become a partner, simply sign up for our affiliate program through the registration form. Once approved, you'll receive access to your personal dashboard and promotional materials to start referring clients.",
  },
  {
    title: 'What percentage will I receive for each referred client?',
    content:
      "Our partners receive a competitive commission rate for each referred client. The exact percentage may vary depending on the client's activity and the partner's tier. Typical rates range from 20% to 40%.",
  },
  {
    title: 'How often are payouts made?',
    content:
      'Payouts are processed on a monthly basis. You will receive your earnings via your selected payment method at the beginning of each month, provided you meet the minimum payout threshold.',
  },
  {
    title: 'What tools are provided for partners?',
    content: `We provide a comprehensive set of tools to help you effectively attract clients and grow your earnings. After registering for the affiliate program, you'll gain access to your personal dashboard where you can:
- Track client statistics and analytics
- Use ready-made promotional materials (banners, text copies, images)
- Receive a unique referral link for automatic tracking of your referred clients`,
  },
];

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
      {FAQItems.map((item) => (
        <AccordionItem item={item} key={item.title} />
      ))}
    </div>
  </div>
);
