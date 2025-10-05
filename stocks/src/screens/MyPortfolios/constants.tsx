import { TabModel } from '@/components/Tabs/Tab';
import { ReactNode } from 'react';
import DefaultIcon from './img/MOEX_LNZL.svg';
import EditModal from './Modals/EditModal';
import DelModal from './Modals/DelModal';
import AddAsset from './Modals/AddAsset';

interface PortfolioListEl {
  img: ReactNode;
  company_name: string;
  company_short_name: string;
  count: number;
  sum: number;
  sum_today: number;
  sum_average: number;
  sum_day: number;
  sum_period: number;
  note: string;
  note_date: string;
}

export const PORTFOLIO_TABLE_DATA: PortfolioListEl[] = [
  {
    img: <DefaultIcon />,
    company_name: 'Лензолото',
    company_short_name: 'LNZL',
    count: 300,
    sum: 250000,
    sum_today: 65,
    sum_average: 65,
    sum_day: 2800,
    sum_period: 2800,
    note: 'Продать',
    note_date: '28.12.24',
  },
  {
    img: <DefaultIcon />,
    company_name: 'Лензолото',
    company_short_name: 'LNZL',
    count: 300,
    sum: 250000,
    sum_today: 65,
    sum_average: 65,
    sum_day: 2800,
    sum_period: 2800,
    note: 'Продать',
    note_date: '28.12.24',
  },
  {
    img: <DefaultIcon />,
    company_name: 'Лензолото',
    company_short_name: 'LNZL',
    count: 300,
    sum: 250000,
    sum_today: 65,
    sum_average: 65,
    sum_day: 2800,
    sum_period: 2800,
    note: 'Продать',
    note_date: '28.12.24',
  },
  {
    img: <DefaultIcon />,
    company_name: 'Лензолото',
    company_short_name: 'LNZL',
    count: 300,
    sum: 250000,
    sum_today: 65,
    sum_average: 65,
    sum_day: 2800,
    sum_period: 2800,
    note: 'Продать',
    note_date: '28.12.24',
  },
  {
    img: <DefaultIcon />,
    company_name: 'Лензолото',
    company_short_name: 'LNZL',
    count: 300,
    sum: 250000,
    sum_today: 65,
    sum_average: 65,
    sum_day: 2800,
    sum_period: 2800,
    note: 'Продать',
    note_date: '28.12.24',
  },
  {
    img: <DefaultIcon />,
    company_name: 'Лензолото',
    company_short_name: 'LNZL',
    count: 300,
    sum: 250000,
    sum_today: 65,
    sum_average: 65,
    sum_day: 2800,
    sum_period: 2800,
    note: 'Продать',
    note_date: '28.12.24',
  },
  {
    img: <DefaultIcon />,
    company_name: 'Лензолото',
    company_short_name: 'LNZL',
    count: 300,
    sum: 250000,
    sum_today: 65,
    sum_average: 65,
    sum_day: 2800,
    sum_period: 2800,
    note: 'Продать',
    note_date: '28.12.24',
  },
  {
    img: <DefaultIcon />,
    company_name: 'Лензолото',
    company_short_name: 'LNZL',
    count: 300,
    sum: 250000,
    sum_today: 65,
    sum_average: 65,
    sum_day: 2800,
    sum_period: 2800,
    note: 'Продать',
    note_date: '28.12.24',
  },
];

export const tabs: TabModel[] = [
  { key: 'general', name: 'Общий портфель' },
  { key: 'portfolio_1', name: 'Портфель №1' },
  { key: 'portfolio_2', name: 'Портфель №2' },
] as const;

export interface IModdalProps {
  title: string;
  component: ReactNode;
}

type TModal = 'edit' | 'del' | 'addAsset';

export const MODALS_LIST: Record<TModal, IModdalProps> = {
  edit: { title: 'Редактировать портфель', component: <EditModal /> },
  del: { title: 'Удалить портфель?', component: <DelModal /> },
  addAsset: { title: 'Добавить актив', component: <AddAsset /> },
};
