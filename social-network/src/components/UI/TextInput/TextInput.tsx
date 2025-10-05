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
    <div className={clsx(wrapperClassName, 'w-full relative')}>
      {label && (
        <p
          className={clsx(labelClassName, 'mb-[6px] text-basic', {
            'flex justify-between items-center': error,
          })}
        >
          {label && <span className='opacity-50'>{label}</span>}
        </p>
      )}
      <div
        className={clsx(
          inputWrapperClassName,
          'flex justify-between items-center bg-[#FFFFFF14] w-full rounded-lg px-4 py-2 text-[15px] leading-5',
          { 'border-red ': error },
          { 'text-red': error && isfillTextWhileError },
        )}
      >
        {iconPosition === 'left' && icon}
        {beforeIcon && beforeIcon}
        <input
          className={clsx(
            className,
            'w-full focus:outline-none focus:border-transparent bg-transparent placeholder:transition-opacity focus:placeholder:opacity-0',
          )}
          {...rest}
        />
        {iconPosition === 'right' && icon}
      </div>
      {/* {error && <span className=' text-error text-[10px] text-red '>{error}</span>} */}
    </div>
  );
};

export default Input;
