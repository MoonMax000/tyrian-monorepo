import React from 'react';

interface TableProps<T> {
  headers: React.ReactNode;
  data: T[];
  renderRow: (item: T, index: number) => React.ReactNode;

  bodyClassname?: string;
}

const Table = <T,>({ headers, data, renderRow, bodyClassname }: TableProps<T>) => {
  return (
    <div className='w-full'>
      <div>{headers}</div>
      <div className={bodyClassname}>
        {data.map((item, index) => (
          <div key={index}>{renderRow(item, index)}</div>
        ))}
      </div>
    </div>
  );
};

export default Table;
