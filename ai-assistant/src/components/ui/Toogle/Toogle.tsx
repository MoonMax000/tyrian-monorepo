import { cn } from '@/utilts/cn';
import { FC } from 'react';

interface IProps {
  state: boolean;
  onChange: (newState: boolean) => void;
  variant?: 'gray';
}

const variants: Readonly<
  Record<
    NonNullable<IProps['variant']>,
    { activeBgColor: string; inactiveBgColor: string; inactiveField: string }
  >
> = {
  gray: {
    activeBgColor: 'bg-green',
    inactiveBgColor: 'bg-custom-blur',
    inactiveField: 'bg-white',
  },
};

export const Toggle: FC<IProps> = ({ state, onChange, variant = 'gray' }) => {
  const bgColorClass = state
    ? variants[variant].activeBgColor
    : variants[variant].inactiveBgColor;
  const fieldColorClass = !state ? variants[variant].inactiveField : 'bg-white';

  return (
    <div
      className={cn(
        'relative w-[54px] h-[28px] border-[1px] border-regaliaPurple rounded-full flex items-center px-[2px] cursor-pointer transition-all duration-200 ease-in-out shrink-0',
        bgColorClass,
      )}
      onClick={() => {
        onChange(!state);
      }}
    >
      <div
        className={cn(
          'absolute rounded-full size-5 transition-all duration-200 ease-in-out',
          fieldColorClass,
          {
            'left-[3px]': !state,
            'left-[32px]': state,
          },
        )}
      />
    </div>
  );
};
