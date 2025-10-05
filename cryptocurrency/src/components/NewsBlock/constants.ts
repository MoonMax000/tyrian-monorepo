export interface NewsModel {
  id: number;
  date: string;
  title: string;
  description: string;
  comments?: number;
  reposts?: number;
  emodzi?: number;
}

export const mockNews: NewsModel[] = [
  {
    id: 1,
    date: '25 марта, 14:15',
    title: 'РИА Новости',
    description:
      'Россияне чаще всего обращаются к юристам по недвижимости и семейным спорам - "Сбер".',
      comments: 25,
      reposts: 54,
      emodzi: 78
  },
  {
    id: 2,
    date: '24 марта, 18:00',
    title:
      'Московская биржа',
    description: 'Россияне чаще всего обращаются к юристам по недвижимости и семейным спорам - "Сбер".',
    comments: 172,
    reposts: 233,
    emodzi: 456
  },
  {
    id: 3,
    date: '24 марта, 12:30',
    title: 'РБК',
    description: 'Сбербанк обсуждает изменение условий льготного кредитования АПК, пока кредитует ...',
    comments: 1241,
    reposts: 9484,
    emodzi: 1210
  },
];
