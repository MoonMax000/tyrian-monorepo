import { type TabModel } from '@/components/Tabs/Tab';

export interface NewsModel {
  id: number;
  date: string;
  title: string;
}

export const mockStatisticsData = ['Market cap', 'EV', 'Beta', 'Shares', 'YTD'];

export const tabs: TabModel[] = [
  { key: 'actions', name: 'Агрегатор новостей' },
  { key: 'financial_indicators', name: 'Мои ленты' },
  { key: 'dividends', name: 'Ленты Turian trade' },
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
