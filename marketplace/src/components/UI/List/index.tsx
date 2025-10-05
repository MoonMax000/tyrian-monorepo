import { Children, SVGProps, FC, ComponentType } from 'react';
import clsx from 'clsx';

import DotIcon from '@/assets/icons/icon-dot.svg';

interface IListProps {
  Icon?: ComponentType<SVGProps<SVGSVGElement>>;
  list: string[];
  className?: string;
  itemClassName?: string;
}

const List: FC<IListProps> = ({ Icon, list, className, itemClassName }) => {
  const MarkerIcon = (Icon ?? DotIcon) as ComponentType<SVGProps<SVGSVGElement>>;

  return (
    <ul className={clsx('flex flex-col gap-y-2 text-[15px] font-medium', className)}>
      {list.map((item) => (
        <li key={item} className={clsx('flex items-center gap-x-2', itemClassName)}>
          <span>
            <MarkerIcon width={16} height={16} className='text-lightPurple' />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
};

export default List;
