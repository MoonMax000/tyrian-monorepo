import { FC, useState, useCallback } from 'react';
import { ChevronRight } from 'lucide-react';
import clsx from 'clsx';

export interface DropdownMenuItem {
  name: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  isDanger?: boolean;
  subItems?: DropdownMenuItem[];
}

export interface DropdownMenuProps {
  items: DropdownMenuItem[];
  className?: string;
}

const MenuItem: FC<{
  item: DropdownMenuItem;
  index: number;
  isHovered: boolean;
  onHover: (index: number | null) => void;
}> = ({ item, index, isHovered, onHover }) => {
  const hasSubItems = !!item.subItems?.length;

  const handleClick = useCallback(() => {
    if (!hasSubItems) {
      item.onClick?.();
    }
  }, [hasSubItems, item.onClick]);

  return (
    <li
      className={`relative flex items-center justify-between gap-2 px-3 py-3 rounded-md cursor-pointer hover:bg-moonlessNight ${
        item.isDanger ? 'text-red' : 'text-white'
      }`}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      onClick={handleClick}
    >
      <div className='flex items-center gap-2'>
        {item.icon && <span className='w-6 h-6'>{item.icon}</span>}
        <span className='text-sm'>{item.name}</span>
      </div>
      {hasSubItems && <ChevronRight size={16} />}
      {hasSubItems && isHovered && (
        <ul className='absolute top-0 left-full bg-blackedGray border border-moonlessNight min-w-[180px] rounded-xl z-50'>
          {item.subItems!.map((subItem, subIndex) => (
            <li
              key={subIndex}
              className={`flex items-center gap-2 px-3 py-3 cursor-pointer hover:bg-moonlessNight rounded-md ${
                subItem.isDanger ? 'text-red' : 'text-white'
              }`}
              onClick={subItem.onClick}
            >
              {subItem.icon && <span className='w-6 h-6'>{subItem.icon}</span>}
              <span className='text-sm'>{subItem.name}</span>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export const DropdownMenu: FC<DropdownMenuProps> = ({ items, className }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleHover = useCallback((index: number | null) => {
    setHoveredIndex(index);
  }, []);

  return (
    <ul
      className={clsx(
        className,
        'bg-blackedGray rounded-xl border border-moonlessNight min-w-[180px] z-50',
      )}
    >
      {items.map((item, index) => (
        <MenuItem
          key={index}
          item={item}
          index={index}
          isHovered={hoveredIndex === index}
          onHover={handleHover}
        />
      ))}
    </ul>
  );
};
