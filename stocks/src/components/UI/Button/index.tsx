import clsx from 'clsx';
import { FC } from 'react';

interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  variant?: 'default' | 'danger' | 'transparent';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
  default: 'bg-purple text-white hover:bg-white hover:text-black',
  danger: 'bg-darkRed text-red',
  transparent: 'bg-transparent border-[2px] border-moonlessNight text-white hover:bg-moonlessNight',
};

const Button: FC<ButtonProps> = ({
  children,
  type = 'button',
  className,
  variant = 'default',
  icon,
  iconPosition = 'left',
  ...rest
}) => {
  return (
    <button
      type={type}
      className={clsx(
        'text-body-15 block rounded-lg text-center p-[10px] transition-all disabled:opacity-45',
        className,
        variants[variant],
      )}
      {...rest}
    >
      <div className='flex items-center align-end justify-center gap-2'>
        {icon && iconPosition === 'left' && <span className='flex-shrink-0'>{icon}</span>}
        <span>{children}</span>
        {icon && iconPosition === 'right' && <span className='flex-shrink-0'>{icon}</span>}
      </div>
    </button>
  );
};

export default Button;
