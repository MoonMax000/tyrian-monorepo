import React from 'react';

interface ITableFallbackProps {
  isVisible: boolean;
  message: string;
  columnCount: number;
}

export const TableFallback: React.FC<ITableFallbackProps> = ({
  isVisible,
  message,
  columnCount,
}) => {
  if (!isVisible) {
    return null;
  }

  return (
    <tr>
      <td colSpan={columnCount} className='py-6 text-center'>
        <span className='text-[19px] font-bold text-white'>{message}</span>
      </td>
    </tr>
  );
};
