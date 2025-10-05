import Review from './components/Tabs/Review';
import Finance from './components/Tabs/Finance';
import Dividents from './components/Tabs/Dividents';
import StatisticTab from './components/Tabs/Statistic';
import { CalendarBlock } from '../PromotionScreen/components/CalendarBlock';
import { NewsTab } from './components/Tabs/News';

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

export const tabs = [
  { title: 'Overview', value: 'overview', Component: Review },
  { title: 'Financials', value: 'financials', Component: Finance },
  { title: 'Dividends', value: 'dividends', Component: Dividents },
  // { title: 'Events', value: 'events', Component: Events },
  { title: 'News', value: 'news', Component: NewsTab },
  { title: 'Statistics', value: 'statistics', Component: StatisticTab },
  { title: 'Calendar', value: 'calendar', Component: CalendarBlock },
  { title: 'Notes', value: 'notes' },
];

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

export const sberAttributes = [
  { title: 'Sector', value: 'Finance' },
  { title: 'Headquarters', value: 'Moscow' },
  { title: 'Industry', value: 'Regional Banks' },
  { title: 'Founded', value: '1841' },
  { title: 'CEO', value: 'Herman Oskarovich Gref' },
  { title: 'ISIN', value: 'RU0009029540' },
  { title: 'Website', value: 'sberbank.ru' },
];
