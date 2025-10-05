import React from 'react';
import clsx from 'clsx';

interface IContentWrapperProps extends React.HTMLAttributes<HTMLDivElement> {}

const ContentWrapper: React.FC<IContentWrapperProps> = ({ children, className, ...props }) => (
  <div
    className={clsx(className, 'rounded-[24px] border-[1px] border-regaliaPurple bg-background')}
    {...props}
  >
    {children}
  </div>
);

export default ContentWrapper;
