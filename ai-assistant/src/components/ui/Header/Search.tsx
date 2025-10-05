import clsx from 'clsx';
import { type DetailedHTMLProps, type FC, type InputHTMLAttributes, type ReactNode } from 'react';

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

export const Search: FC<InputProps> = ({
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
          <p
            className={clsx(
              labelClassName,
              'mb-[6px] text-body-15 opacity-[48%]',
            )}
          >
            {label}
          </p>
        )}
        <div
          className={clsx(
            'flex justify-between items-center w-full rounded-lg px-4 py-2 text-body-15 search-wrapper border border-[#482090]',
            { 'border-red ': error },
            { 'text-red': error && isfillTextWhileError },
            inputWrapperClassName,
          )}
        >
          <span className='mr-2'> {iconPosition === 'left' && icon}</span>
          {beforeIcon && beforeIcon}
          <input
            className={clsx(
              className,
              'w-full placeholder:transition-opacity focus:placeholder:opacity-0 focus:outline-none search-input',
            )}
            {...rest}
          />
          {iconPosition === 'right' && icon}
        </div>

        {error && <span className='mb-1 text-red text-body-12'>{error}</span>}
      </div>
    );
};
