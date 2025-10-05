import type { Dispatch, SetStateAction } from 'react';
import clsx from 'clsx';
import ChevronDownIcon from '@/assets/icons/chevron-down.svg';
import type { IColumn, SortingState } from '../model/types';

interface ITableHeadingCellProps<T extends object> {
  column: IColumn<T>;
  sorting?: SortingState[keyof SortingState];
  setSorting?: Dispatch<SetStateAction<SortingState>>;
}

export const TableHeadingCell = <T extends object>({
  column,
  sorting,
  setSorting,
}: ITableHeadingCellProps<T>) => {
  const handleSetSorting = () => {
    const sortingKey = (column.sortingKey || column.key) as string;
    const sortingValue = sorting ? (sorting === 'asc' ? 'desc' : 'asc') : 'desc';
    if (column.sortingKey !== column.key) {
      setSorting?.({ [sortingKey]: sortingValue });
    } else {
      setSorting?.((prev) => ({ ...prev, [sortingKey]: sortingValue }));
    }
  };

  return (
    <th
      key={String(column.key)}
      className={clsx(
        'uppercase py-3 px-6 font-bold text-[12px] text-[#B0B0B0]',
        column.columnClassName,
      )}
    >
      <div className='inline-flex items-center gap-1'>
        <span>{column.renderColumn ? column.renderColumn() : column.label}</span>
        {column.enableSorting && (
          <button
            onClick={handleSetSorting}
            className={clsx(
              'flex items-center justify-center bg-none border-none transition-transform duration-100 ease-in-out',
              {
                'rotate-180': sorting === 'desc',
              },
            )}
          >
            <ChevronDownIcon />
          </button>
        )}
      </div>
    </th>
  );
};
