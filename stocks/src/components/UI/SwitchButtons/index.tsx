'use client';

import type { ReactNode } from 'react';
import clsx from 'clsx';
import Button from '../Button';

export interface SwitchItems<T> {
  value: T;
  label: string;
  [key: string]: any;
}

interface ISwitchButtonsProps<T> {
  items: SwitchItems<T>[];
  currentValue: T;
  onChange: (value: T) => void;
  renderButton?: (item: SwitchItems<T>, index: number) => ReactNode;
  className?: string;
  itemClassName?: string;
}

const SwitchButtons = <T,>({
  items,
  currentValue,
  onChange,
  renderButton,
  className,
  itemClassName,
}: ISwitchButtonsProps<T>) => {
  return (
    <ul className={clsx('flex items-center gap-2 flex-wrap', className)}>
      {items.map(({ value, label, ...props }, i) => (
        <li key={String(value)} className={clsx(itemClassName)}>
          <Button
            variant={currentValue === value ? 'default' : 'transparent'}
            onClick={() => onChange(value)}
          >
            {renderButton ? renderButton({ value, label, ...props }, i) : label}
          </Button>
        </li>
      ))}
    </ul>
  );
};

export default SwitchButtons;
