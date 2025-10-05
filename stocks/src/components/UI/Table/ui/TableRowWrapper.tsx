import React from 'react';

interface ITableRowWrapperProps {
  className?: string;
  children: React.ReactNode;
}

export const TableRowWrapper: React.FC<ITableRowWrapperProps> = ({ className, children }) => (
  <td className={className}>
    <div className='inline-flex items-center'>{children}</div>
  </td>
);
