import { cn } from '@/utilts/cn';
import { FC } from 'react';

const Paper: FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>> = ({
  className,
  children,
  ...rest
}) => {
  return (
    <div
      className={cn(
        'rounded-3xl bg-color-gunpowder border border-regaliaPurple bg-[#0C1014]/50 backdrop-blur-[100px] shadow-lg shadow-black/10 ', className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Paper;
