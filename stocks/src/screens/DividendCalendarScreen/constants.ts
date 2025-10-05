import { type TabModel } from '@/components/Tabs/Tab';

export interface NewsModel {
  id: number;
  date: string;
  title: string;
}

export const mockStatisticsData = ['Market cap', 'EV', 'Beta', 'Shares', 'YTD'];

// export const mockStatisticsData = [
//   {
//     label: 'Market cap',
//     data: 22050000000,
//     key: 'market_cap',
//     tooltip: 'tooltip',
//     indicator: 'rub',
//   },
//   { label: 'EV', data: 21960000000, key: 'ev', tooltip: 'tooltip', indicator: 'rub' },
//   { label: 'Beta', data: 0.74, key: 'beta', tooltip: 'tooltip', indicator: '' },
//   { label: 'Shares', data: 57270000, key: 'shares', tooltip: 'tooltip', indicator: 'rub' },
//   { label: 'YTD', data: -63.13, key: 'ytd', tooltip: 'tooltip', indicator: 'percent' },
// ];

export const tabs: TabModel[] = [
  { key: 'review', name: 'Обзор' },
  { key: 'financial_indicators', name: 'Financial Metrics' },
  { key: 'dividends', name: 'Дивиденды' },
  { key: 'actions', name: 'События' },
] as const;

export const mockNews: NewsModel[] = [
  {
    id: 1,
    date: '29 августа в 20:25',
    title:
      'Globaltruck в I полугодии по МСФО получил 85.5 млн руб. убытка против прибыли годом ранее',
  },
  {
    id: 2,
    date: '7 июня в 18:55',
    title:
      'Транспортно-логистическая группа Монополия думает об IPO в 25г, сохранит листинг Globaltruck.',
  },
  {
    id: 3,
    date: '27 апреля в 17:25',
    title: 'Чистая прибыль Globaltruck по МСФО за 2023 год выросла почти в 9 раз, до 882 млн руб.',
  },
  {
    id: 4,
    date: '26.12.23 в 18:25',
    title:
      'Мосбиржа проводит дискретный аукцион по акциям Globaltruck из-за роста более чем на 20%',
  },
  {
    id: 5,
    date: '29.08.23 в 18:50',
    title:
      'Чистая прибыль Globaltruck по МСФО в I полугодии выросла в 13.2 раза - до 236.022 млн руб.',
  },
];

export const FAQItems = [
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
