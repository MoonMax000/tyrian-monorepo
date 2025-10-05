import clsx from 'clsx';
import { DetailedHTMLProps, FC, InputHTMLAttributes, ReactNode } from 'react';

interface InputProps
  extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  wrapperClassName?: string;
  labelClassName?: string;
  inputWrapperClassName?: string;
  label?: string;
  icon?: ReactNode;
  beforeIcon?: ReactNode;
  iconPosition?: 'left' | 'right';
  error?: string;
  isfillTextWhileError?: boolean;
}

const Input: FC<InputProps> = ({
  label,
  icon,
  iconPosition = 'right',
  wrapperClassName,
  labelClassName,
  inputWrapperClassName,
  className,
  error,
  isfillTextWhileError,
  beforeIcon,

  ...rest
}) => {
  return (
    <div className={clsx(wrapperClassName, 'w-full')}>
      {label && (
        <p className={clsx(labelClassName, 'mb-[6px] text-[15px] font-bold text-grayLight')}>
          {label}
        </p>
      )}
      <div
        className={clsx(
          inputWrapperClassName,
          'flex justify-between items-center bg-background w-full rounded-lg border-[1px] border-regaliaPurple px-4 py-2 text-[15px]',
          { 'border-red ': error },
          { 'text-red': error && isfillTextWhileError },
        )}
      >
        {iconPosition === 'left' && icon}
        {beforeIcon && beforeIcon}
        <input
          className={clsx(
            className,
            'w-full bg-transparent placeholder:transition-opacity focus:placeholder:opacity-0',
          )}
          {...rest}
        />
        {iconPosition === 'right' && icon}
      </div>
      {error && <span className='mb-1 text-red text-body-12'>{error}</span>}
    </div>
  );
};

export default Input;
