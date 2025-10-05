import clsx from 'clsx';
import { TableRowWrapper } from './TableRowWrapper';
import type { IColumn } from '../model/types';

interface ITableRowCellProps<T extends object> {
  column: IColumn<T>;
  row: T;
}

export const TableRowCell = <T extends object>({ column, row }: ITableRowCellProps<T>) => (
  <TableRowWrapper key={String(column.key)} className={clsx('py-3 px-6', column.rowClassName)}>
    <div className='inline-flex items-center'>
      {column.renderCell ? column.renderCell(row) : String(row[column.key])}
    </div>
  </TableRowWrapper>
);
