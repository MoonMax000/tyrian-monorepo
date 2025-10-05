import { cn } from '@/utilts/cn';
import React, { ReactNode } from 'react';

type ContentWrapperProps = {
  children: ReactNode;
  className?: string;
  contentWrapperClassname?: string;
};

const ContentWrapper: React.FC<ContentWrapperProps> = ({ children, className = '', contentWrapperClassname }) => (
  <div className={cn('w-full max-w-[1059px] mx-auto px-1 mt-[34px]', className, contentWrapperClassname)}>{children}</div>
);

export default ContentWrapper;
