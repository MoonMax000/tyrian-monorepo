import type { ReactNode, Dispatch, SetStateAction } from 'react';
import clsx from 'clsx';
import Pagination, { type IPaginationProps } from '../../Pagination';
import Skeleton from '../../Skeleton';
import type { IColumn, SortingState, FilterState } from '../model/types';
import { TableHeadingCell } from './TableHeadingCell';
import { TableRowWrapper } from './TableRowWrapper';
import { TableRowCell } from './TableRowCell';
import { TableFallback } from './TableFallback';

interface TableProps<T extends object> {
  columns: IColumn<T>[];
  rows: T[];
  loading?: boolean;
  error?: string;
  rowKey: keyof T | ((item: T, index: number) => string);
  pagination?: IPaginationProps;
  sorting?: SortingState;
  filters?: FilterState;
  setSorting?: Dispatch<SetStateAction<SortingState>>;
  setFilters?: (filters: FilterState) => void;
  topContent?: ReactNode;
  bottomContent?: ReactNode;
  containerClassName?: string;
  tableClassName?: string;
}

export const Table = <T extends object>({
  columns,
  rows,
  rowKey,
  pagination,
  sorting,
  setSorting,
  error,
  loading,
  topContent,
  bottomContent,
  containerClassName,
  tableClassName,
}: TableProps<T>) => {
  const isError = !!error;

  const isEmpty = !loading && !isError && rows.length === 0;

  const isSuccess = !loading && !isError && rows.length > 0;

  return (
    <div>
      <div
        className={clsx(
          'w-full rounded-[24px] border-[1px] border-gunpowder overflow-hidden',
          containerClassName,
        )}
      >
        {topContent && topContent}
        <div className='w-full overflow-x-auto'>
          <table className={clsx('w-full border-collapse overflow-x-auto', tableClassName)}>
            <thead>
              <tr className='text-right bg-gunpowder'>
                {columns.map((column) => (
                  <TableHeadingCell
                    key={column.key as string}
                    column={column}
                    sorting={sorting?.[(column.sortingKey ?? column.key) as string]}
                    setSorting={setSorting}
                  />
                ))}
              </tr>
            </thead>
            <tbody>
              {isSuccess &&
                rows.map((row, i) => (
                  <tr
                    key={`${
                      typeof rowKey === 'function' ? rowKey(row, i) : String(row[rowKey])
                    }${i}`}
                    className='text-right text-[12px] font-bold text-white border-b-[2px] last:border-none border-gunpowder'
                  >
                    {columns.map((column) => (
                      <TableRowCell key={column.key as string} column={column} row={row} />
                    ))}
                  </tr>
                ))}
              <TableFallback isVisible={isEmpty} message='No data' columnCount={columns.length} />
              <TableFallback
                isVisible={isError}
                message='Something went wrong'
                columnCount={columns.length}
              />
              {loading &&
                [...new Array(10).fill(null)].map((_, i) => (
                  <tr
                    key={`${i + Math.random()}`}
                    className='text-right text-[12px] font-bold text-white border-b-[2px] last:border-none border-gunpowder'
                  >
                    {columns.map((column) => (
                      <TableRowWrapper
                        key={column.key as string}
                        loading={loading}
                        className={clsx('py-3 px-6', column.rowClassName)}
                      >
                        <Skeleton variant='text' className='w-full' />
                      </TableRowWrapper>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      {bottomContent && bottomContent}
      {pagination && (
        <div className='flex justify-center mt-6'>
          <Pagination {...pagination} />
        </div>
      )}
    </div>
  );
};
