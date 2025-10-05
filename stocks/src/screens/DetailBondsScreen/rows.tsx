import { getCorrectDate } from '@/helpers/getCorrectDate';
import mockBondsImg from '@/assets/mock-bonds.png';

export const rows = new Array(20).fill({
  id: Math.random(),
  symbol: 'MRVL',
  maturity: 51.7,
  matDate: getCorrectDate(new Date()),
  img: mockBondsImg.src,
  name: 'NVIDIA CORP 2020-01.04.30 GLOBAL',
  shortName: 'SHW5459736',
});

export const floatRows = new Array(20).fill({
  id: Math.random(),
  symbol: 'AVAL5808586',
  coupon: 100.3,
  maturity: 51.7,
  matDate: getCorrectDate(new Date()),
  img: mockBondsImg.src,
  name: 'Banco de Occidente S.A. 10.875% 13-AUG-2034',
  shortName: 'AVAL5808586',
});

export const govtRows = new Array(20).fill({
  id: Math.random(),
  symbol: 'AVAL5808586',
  coupon: 4.62,
  yieldPercent: 4.642,
  changePercent: 4.62,
  change: '−0.008PCTPAR',
  price: '−0.008PCTPAR',
  maturity: 51.7,
  matDate: getCorrectDate(new Date()),
  img: mockBondsImg.src,
  name: 'United States 1 Month Govern...',
  shortName: 'US01MY',
});
