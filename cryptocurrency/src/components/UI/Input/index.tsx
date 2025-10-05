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
        <p className={clsx(labelClassName, 'mb-[6px] text-basic opacity-[48%]')}>{label}</p>
      )}
      <div
        className={clsx(
          inputWrapperClassName,
          'flex justify-between items-center bg-[#FFFFFF14] w-full rounded-lg border-[2px] border-[#FFFFFF14] px-4 py-2 text-[15px] leading-5',
          { 'border-error ': error },
          { 'text-error': error && isfillTextWhileError },
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
      {error && <span className='mb-1 text-error text-[12px]'>{error}</span>}
    </div>
  );
};

export default Input;
