import type { FC } from 'react';
import Table, { type IColumn } from '@/components/UI/Table';
import { formatMoney } from '@/helpers/formatMoney';

type TradingVolumesItem = {
  data: string;
  trades: number;
  volumeUnits: number;
  volume: number;
};

const columns: IColumn<TradingVolumesItem>[] = [
  {
    key: 'data',
    label: 'data',
    columnClassName: 'text-left',
    rowClassName: 'text-left',
  },
  {
    key: 'trades',
    label: 'trades',
  },
  {
    key: 'volumeUnits',
    label: 'volume (units)',
  },
  {
    key: 'volume',
    label: 'volume',
    renderCell: ({ volume }) => formatMoney(volume, '$', 2),
  },
];

const tradingVolumesMockData = [
  {
    data: 'Main market',
    trades: 98184,
    volumeUnits: 41150287,
    volume: 11670000000,
  },
  {
    data: 'Negotiated Trades',
    trades: 1,
    volumeUnits: 178570,
    volume: 49990000,
  },
  {
    data: 'Total',
    trades: 114815,
    volumeUnits: 225416300,
    volume: 58250000000,
  },
];

export const TradingVolumesModal: FC = () => (
  <Table
    columns={columns}
    rows={tradingVolumesMockData}
    rowKey='data'
    containerClassName='!rounded-[0px] !border-0'
  />
);
