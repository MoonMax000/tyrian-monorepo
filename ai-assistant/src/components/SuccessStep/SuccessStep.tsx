'use client';
import { FC } from 'react';
import Button from '../ui/Button/Button';

interface Props {
  title?: string;
  description?: string;
  onSubmit: () => void;
  buttonTitle?: string;
}

export const SuccessStep: FC<Props> = ({ title, description, onSubmit, buttonTitle }) => {
  return (
    <div className='flex flex-col text-center justify-between h-full '>
      <div className='flex flex-col'>
        {title && <h2 className='flex flex-start text-2xl font-semibold mb-2'>{title}</h2>}
        {description && (
          <p className='text-[15px] font-normal text-left text-lighterAluminum mb-6'>
            {description}
          </p>
        )}
      </div>
      {buttonTitle
        ? <Button onClick={() => onSubmit()}>{buttonTitle}</Button>
        : <Button onClick={() => onSubmit()}>Done</Button>
      }
    </div>
  );
};
