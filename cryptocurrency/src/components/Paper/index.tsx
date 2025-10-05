import clsx from 'clsx';
import { FC } from 'react';

const Paper: FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>> = ({
  className,
  children,
  ...rest
}) => {
  return (
    <div className={clsx(className, 'rounded-xl bg-blackedGray')} {...rest}>
      {children}
    </div>
  );
};

export default Paper;
