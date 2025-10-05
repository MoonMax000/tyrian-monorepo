import React from 'react';
import DeleteSvg from './delete.svg';
import Button from '@/components/UI/Button/Button';

interface ListItem {
  id: string | number;
  content: React.ReactNode;
}

interface ListProps {
  items: ListItem[];
  buttonTitle?: string;
  onDelete?: (id: string | number) => void;
  onAdd?: () => void;
  className?: string;
}

const List: React.FC<ListProps> = ({ items, onDelete, onAdd, buttonTitle = "Add", className = '' }) => {
  const handleDelete = (id: string | number) => {
    if (onDelete) {
      onDelete(id);
    }
  };

  return (
    <div className={`flex gap-4 flex-col ${className}`}>
      <div className={`flex gap-2 flex-col`}>
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between"
          >
            <div className="flex-1 pr-4">
              {item.content}
            </div>
            {onDelete && (
              <button
                onClick={() => handleDelete(item.id)}
                aria-label="Удалить элемент"
              >
                <DeleteSvg className="w-[26px] h-[26px]" />
              </button>
            )}
          </div>
        ))}
      </div>

      <Button
        className="h-[26px] py-[3px] w-full font-semibold text-[15px] leading-[20px] tracking-normal"
        variant="secondary"
        onClick={onAdd}
      >
        +&nbsp;{buttonTitle}
      </Button>
    </div>
  );
};

export default List;
