export interface NoteCalendarItemProps {
  title: string;
  stocksList: string[];
  color?: string;
  img: string;
  day?: number | null;
  desc?: string;
  classNameImage?: string;
}

export const NotesMockData: NoteCalendarItemProps[] = [
  {
    title: 'Shareholders Meeting',
    stocksList: ['PLZL'],
    color: 'red',
    img: '/event.png',
  },
  {
    title: 'Dividends',
    stocksList: ['KAZT', 'AQUA', 'PLZL', 'AVAN', 'AGRO'],
    color: 'purple',
    img: '/event.png',
  },
  {
    title: 'Financial Results',
    stocksList: ['BNS', 'CRM'],
    color: 'blue',
    img: '/event.png',
  },
  {
    title: 'Shareholders Meeting',
    stocksList: ['REN', 'CSCO', 'SCT'],
    color: 'red',
    img: '/event.png',
  },
  {
    title: 'Dividends',
    stocksList: ['MRSB', 'HNFG'],
    color: 'purple',
    img: '/event.png',
  },
  {
    title: 'Financial Results',
    stocksList: ['ASYS', 'ORAZ', 'YEXT', 'ORCL', 'CASY', 'MDB', 'HOY'],
    color: 'blue',
    img: '/event.png',
  },
  {
    title: 'Shareholders Meeting',
    stocksList: ['UTAR', 'DQ', 'SCSC', 'MSFT'],
    color: 'red',
    img: '/event.png',
  },
  {
    title: 'Operating results',
    stocksList: ['HNFG'],
    color: 'orange',
    img: '/event.png',
  },
  {
    title: 'Operating results',
    stocksList: ['AFLT'],
    color: 'orange',
    img: '/event.png',
  },
  {
    title: 'Dividends',
    stocksList: ['ANT', 'SPWH', 'GME', 'SFX', 'AZO', 'UNFI', 'FERG', 'DBI', 'SBER'],
    color: 'purple',
    img: '/event.png',
  },
  {
    title: 'Financial Results',
    stocksList: [
      'NX',
      'RSW',
      'LEN',
      'JBL',
      'AASYS',
      'CIEN',
      'COST',
      'RH',
      'ONYZ',
      'AVGO',
      'SCHL',
      'LQDT',
    ],
    color: 'blue',
    img: '/event.png',
  },
  {
    title: 'Shareholders Meeting',
    stocksList: ['AZO', 'QTO', 'ABRD'],
    color: 'red',
    img: '/event.png',
  },
  {
    title: 'Board of Directors',
    stocksList: ['FEES'],
    color: 'green',
    img: '/event.png',
  },
  {
    title: 'Financial Results',
    stocksList: ['MU', 'JBL', 'LEN', 'TTC', 'SCS', 'GIS'],
    color: 'blue',
    img: '/event.png',
  },
  {
    title: 'Shareholders Meeting',
    stocksList: ['ABF', 'HL', 'NDM', 'CRPT', 'JAKK', 'VIPS', 'HEAD', 'CHMF', 'GEMA', 'LKOH'],
    color: 'red',
    img: '/event.png',
  },
  {
    title: 'Other',
    stocksList: ['SBER'],
    color: 'white',
    img: '/event.png',
  },
  {
    title: 'Dividends',
    stocksList: ['WUSH', 'HNFG'],
    color: 'purple',
    img: '/event.png',
  },
  {
    title: 'Shareholders Meeting',
    stocksList: ['NTNX', 'NAUK'],
    color: 'red',
    img: '/event.png',
  },
  {
    title: 'Dividends',
    stocksList: ['FIXP', 'NKHP'],
    color: 'purple',
    img: '/event.png',
  },
  {
    title: 'Shareholders Meeting',
    stocksList: ['THO', 'BAM'],
    color: 'red',
    img: '/event.png',
  },
  {
    title: 'Other',
    stocksList: ['MTSS'],
    color: 'white',
    img: '/event.png',
  },
  {
    title: 'Dividends',
    stocksList: ['SFIN', 'RENL', 'SOFL'],
    color: 'purple',
    img: '/event.png',
  },
  {
    title: 'Financial Results',
    stocksList: ['ORC9', 'WGO'],
    color: 'blue',
    img: '/event.png',
  },
];
