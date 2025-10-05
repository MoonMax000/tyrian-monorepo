import { corpColumns, floatColumns, govtColumns } from '../DetailBondsScreen/columns';
import mockBondsImg from '@/assets/mock-bonds.png';
import { Bond } from '@/services/StocksService';

export interface CorpRow {
  id: number;
  symbol: string;
  maturity: number;
  matDate: string;
  name: string;
  img: string;
  coupon: number;
  shortName: string;
}

export interface GovtRow {
  id: string;
  name: string;
  shortName: string;
  matDate: string;
  maturity: string;
  img: string;
  changePercent: number;
  change: string;
  yieldPercent: number;
  coupon: number;
}

export interface CorpColumn {
  id: number;
  symbol: string;
  maturity: number;
  matDate: string;
  name: string;
  img: string;
  shortName: string;
}

export interface GovtColumn {
  id: number;
  symbol: string;
  maturity: number;
  matDate: string;
  name: string;
  yieldPercent: number;
  price: string;
  changePercent: number;
  change: string;
  img: string;
  coupon: number;
  shortName: string;
}

export interface FloatColumn {
  id: number;
  symbol: string;
  maturity: number;
  matDate: string;
  name: string;
  img: string;
  coupon: number;
  shortName: string;
}

export const transformBondsData = (data?: Bond[]) => {
  return data?.map((item) => ({
    id: item.id,
    name: item.document_eng,
    shortName: item.bbgid,
    matDate: item.maturity_date,
    maturity: item.cupon_eng,
    img: mockBondsImg.src,
    changePercent: 4.4,
    change: '−0.008PCTPAR',
    yieldPercent: 2.2,
    coupon: 2,
  }));
};

export const getCorpColumns = (filter: string) => {
  switch (filter) {
    case 'Float':
      return floatColumns;
    default:
      return corpColumns;
  }
};

export const getCorpRows = (filter: string, data: Bond[]) => {
  const items = transformBondsData(data) || [];
  switch (filter) {
    case 'Float':
      return items;
    default:
      return items;
  }
};

export const getGovtColumns = (filter: string) => {
  switch (filter) {
    default:
      return govtColumns;
  }
};

export const getGovtRows = (filter: string, data: Bond[]) => {
  const items = transformBondsData(data) || [];
  switch (filter) {
    default:
      return items;
  }
};
