import { IColumn } from '@/components/UI/Table';
import { formatNumberWithSymbols } from '@/helpers/formatNumberWithSymbols';
import Image from 'next/image';
import Link from 'next/link';
import { CorpColumn, FloatColumn, GovtColumn } from '../BondsScreen/helpers';

export const corpColumns: IColumn<CorpColumn>[] = [
  {
    key: 'shortName',
    label: 'Name',
    columnClassName: 'text-left',
    rowClassName: 'text-left',
    enableSorting: true,
    renderCell: ({ img, shortName, name }) => (
      <div className='flex items-center gap-x-[10px]'>
        <div className='flex items-center gap-x-2'>
          <Image src={img} alt={shortName} width={32} height={32} className='rounded-full' />
          <div className='flex flex-col gap-x-1 text-[12px] font-bold'>
            <Link href={`bonds/${shortName}/`} className='text-white hover:underline'>
              {name}
            </Link>
            <span className='uppercase text-[#B0B0B0]'>{shortName}</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    key: 'maturity',
    label: 'Yield to maturity',
    renderCell: ({ maturity }) => {
      return `${maturity}`;
    },
    enableSorting: true,
  },
  {
    key: 'matDate',
    label: 'Maturity date',
    renderCell: ({ matDate }) => {
      return `${matDate}`;
    },
  },
];

export const floatColumns: IColumn<FloatColumn>[] = [
  {
    key: 'symbol',
    label: 'Symbol',
    columnClassName: 'text-left',
    rowClassName: 'text-left',
    enableSorting: true,
    renderCell: ({ img, shortName, name }) => (
      <div className='flex items-center gap-x-[10px]'>
        <div className='flex items-center gap-x-2'>
          <Image src={img} alt={shortName} width={32} height={32} className='rounded-full' />
          <div className='flex flex-col gap-x-1 text-[12px] font-bold'>
            <Link href={`bonds/${shortName}/`} className='text-white hover:underline'>
              {name}
            </Link>
            <span className='uppercase text-[#B0B0B0]'>{shortName}</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    key: 'maturity',
    label: 'Yield to maturity',
    renderCell: ({ maturity }) => {
      return `${maturity}`;
    },
    enableSorting: true,
  },
  {
    key: 'coupon',
    label: 'Coupon',
    renderCell: ({ coupon }) =>
      formatNumberWithSymbols({
        num: coupon,
        symbolAfter: '%',
        toFixed: 2,
      }),
    enableSorting: true,
  },
];

export const govtColumns: IColumn<GovtColumn>[] = [
  {
    key: 'symbol',
    label: 'Symbol',
    columnClassName: 'text-left',
    rowClassName: 'text-left',
    enableSorting: true,
    renderCell: ({ img, shortName, name }) => (
      <div className='flex items-center gap-x-[10px]'>
        <div className='flex items-center gap-x-2'>
          <Image src={img} alt={shortName} width={32} height={32} className='rounded-full' />
          <div className='flex flex-col gap-x-1 text-[12px] font-bold'>
            <Link href={`bonds/${shortName}/`} className='text-white hover:underline'>
              {name}
            </Link>
            <span className='uppercase text-[#B0B0B0]'>{shortName}</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    key: 'coupon',
    label: 'Coupon',
    renderCell: ({ coupon }) =>
      formatNumberWithSymbols({
        num: coupon,
        symbolAfter: '%',
        toFixed: 2,
      }),
    enableSorting: true,
  },
  {
    key: 'yieldPercent',
    label: 'Yield',
    renderCell: ({ yieldPercent }) =>
      formatNumberWithSymbols({
        num: yieldPercent,
        symbolAfter: '%',
        toFixed: 2,
      }),
    enableSorting: true,
  },
  {
    key: 'matDate',
    label: 'Maturity date',
    renderCell: ({ matDate }) => {
      return `${matDate}`;
    },
  },
  {
    key: 'maturity',
    label: 'Yield to maturity',
    renderCell: ({ maturity }) => {
      return `${maturity}`;
    },
    enableSorting: true,
  },
  {
    key: 'price',
    label: 'Price',
    renderCell: ({ price }) => {
      return `${price}`;
    },
  },
  {
    key: 'changePercent',
    label: 'Change %',
    renderCell: ({ changePercent }) =>
      formatNumberWithSymbols({
        num: changePercent,
        symbolAfter: '%',
        toFixed: 2,
      }),
    enableSorting: true,
  },
  {
    key: 'change',
    label: 'Change',
    renderCell: ({ change }) => {
      return `${change}`;
    },
  },
];
