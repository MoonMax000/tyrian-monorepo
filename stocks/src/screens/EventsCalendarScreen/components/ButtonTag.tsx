import clsx from 'clsx';
import { FC } from 'react';

interface ButtonTagProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  text: string;
  color: string;
  noneBg?: boolean;
  fillCircle?: boolean;
}

const ButtonTag: FC<ButtonTagProps> = ({
  text,
  color,
  className,
  type = 'button',
  noneBg = false,
  fillCircle = false,
  ...rest
}) => {
  const backgroundColor = noneBg ? 'transparent' : `${color}33`;

  return (
    <button
      type={type}
      className={clsx(
        'text-body-12 rounded-lg px-3 py-2 transition-all disabled:opacity-45 flex items-center justify-center gap-2',
        className,
      )}
      style={{
        backgroundColor,
        color: 'white',
      }}
      {...rest}
    >
      <span
        className='w-[12px] h-[12px] border-[2px] rounded-full'
        style={{
          borderColor: color,
          backgroundColor: fillCircle ? color : 'transparent',
        }}
      ></span>
      <span>{text.toUpperCase()}</span>
    </button>
  );
};

export default ButtonTag;
