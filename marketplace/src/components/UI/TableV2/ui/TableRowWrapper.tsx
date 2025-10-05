import React from 'react';
import clsx from 'clsx';

interface ITableRowWrapperProps {
  className?: string;
  loading?: boolean;
  children: React.ReactNode;
}

export const TableRowWrapper: React.FC<ITableRowWrapperProps> = ({
  className,
  loading,
  children,
}) => (
  <td className={className}>
    <div
      className={clsx('items-center', {
        'inline-flex': !loading,
      })}
    >
      {children}
    </div>
  </td>
);
