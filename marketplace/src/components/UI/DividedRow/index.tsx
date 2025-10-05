import { Children, type FC, type ReactNode } from 'react';
import clsx from 'clsx';

interface IDividedRowProps {
  gap: number;
  children: ReactNode;
  className?: string;
}

const DividedRow: FC<IDividedRowProps> = ({ children, gap, className }) => {
  const mappedChildren = Children.map(children, (child, i) => (
    <div style={{ paddingLeft: i === 0 ? 0 : `${gap * 4}px`, paddingRight: `${gap * 4}px` }}>
      {child}
    </div>
  ));

  return (
    <div className={clsx('flex items-center divide-x-[1px] divide-gunpowder', className)}>
      {mappedChildren}
    </div>
  );
};

export default DividedRow;
