import clsx from 'clsx';
import { FC } from 'react';

const Paper: FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={clsx(className, 'rounded-[24px] border-[1px] border-regaliaPurple custom-bg-blur')}
      {...props}
    >
      {children}
    </div>
  );
};

export default Paper;
