'use client';

import { FC, useCallback, useEffect, useLayoutEffect, useState } from 'react';
import Table, { IColumn, type SortingState } from '@/components/UI/Table';
import SwitchButtons, { type SwitchItems } from '@/components/UI/SwitchButtons';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import {
  CorpColumn,
  CorpRow,
  FloatColumn,
  getCorpColumns,
  getCorpRows,
  getGovtColumns,
  getGovtRows,
  GovtColumn,
  GovtRow,
} from '../helpers';
import {
  bondsTypeValues,
  filterValues,
  govtFilterValues,
} from '@/screens/DetailBondsScreen/constants';
import { useQuery } from '@tanstack/react-query';
import { StocksService } from '@/services/StocksService';

export const tabsConfig: Record<string, { tabs: SwitchItems<string>[] }> = {
  corp: {
    tabs: filterValues,
  },
  govt: {
    tabs: govtFilterValues,
  },
};

type PossibleColumns = IColumn<CorpColumn>[] | IColumn<GovtColumn>[] | IColumn<FloatColumn>[];

type PossibleRows = CorpRow[] | GovtRow[];

const BondsTable: FC = () => {
  const [sorting, setSorting] = useState<SortingState>({});
  const [localRows, setLocalRows] = useState<PossibleRows>([]);
  const [localCols, setLocalCols] = useState<PossibleColumns>([]);

  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const currentTab = searchParams.get('tab') || 'corp';
  const currentFilter = searchParams.get('filter') || 'All Bonds';

  const { data: bondsCorporate, isSuccess: isSuccessCorp } = useQuery({
    queryKey: ['corp-bonds', currentTab, currentFilter],
    queryFn: () =>
      StocksService.corporateBonds(currentTab === 'corp' ? currentFilter : 'All Bonds'),
  });

  const { data: bondsGovernment, isSuccess: isSuccessGovt } = useQuery({
    queryKey: ['govt-bonds', currentTab, currentFilter],
    queryFn: () =>
      StocksService.governmentBonds(currentTab === 'govt' ? currentFilter : 'All Bonds'),
  });

  const handleChangeTab = useCallback(
    (newTab: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('filter');
      params.set('tab', newTab);
      replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, searchParams],
  );

  const handleChangeFilter = useCallback(
    (newFilter: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('filter', newFilter);
      replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, searchParams],
  );

  useEffect(() => {
    const tab = searchParams.get('tab');

    if (tab && isSuccessCorp && isSuccessGovt) {
      switch (tab) {
        case 'corp':
          setLocalCols(getCorpColumns(currentFilter));
          setLocalRows(getCorpRows(currentFilter, bondsCorporate?.data.data));
          break;
        case 'govt':
          setLocalCols(getGovtColumns(currentFilter));
          setLocalRows(getGovtRows(currentFilter, bondsGovernment?.data.data));
          break;
        default:
          setLocalCols([]);
          setLocalRows([]);
      }
    }
  }, [searchParams, isSuccessCorp, isSuccessGovt]);

  useLayoutEffect(() => {
    if (!searchParams.has('tab')) {
      const params = new URLSearchParams();
      params.set('tab', 'corp');
      params.set('filter', 'All Bonds');
      replace(`bonds?${params}`);
    }
  }, []);

  return (
    <section className='mt-12'>
      <SwitchButtons
        items={bondsTypeValues}
        currentValue={currentTab}
        onChange={handleChangeTab}
        className='mb-2'
      />
      <SwitchButtons
        items={tabsConfig[currentTab].tabs}
        currentValue={currentFilter}
        onChange={handleChangeFilter}
      />
      <Table
        columns={localCols}
        rows={localRows as GovtColumn[]}
        rowKey='id'
        pagination={{ currentPage: 1, totalPages: 4, onChange: () => {} }}
        sorting={sorting}
        setSorting={setSorting}
        containerClassName='mt-6 backdrop-blur-xl'
      />
    </section>
  );
};

export default BondsTable;
