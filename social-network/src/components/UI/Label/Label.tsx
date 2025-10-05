import React from 'react';
import clsx from 'clsx';
import { LabelProps } from '@/components/UI/Label/types';

const Label = ({ htmlFor, children, className, required = false }: LabelProps) => {
  return (
    <label
      htmlFor={htmlFor}
      className={clsx(
        'block font-semibold',
        { 'after:content-["*"] after:ml-1 after:text-red-500': required },
        className,
      )}
    >
      {children}
    </label>
  );
};

export default Label;