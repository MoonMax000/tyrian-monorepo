import { FC } from 'react';

const ContentWrapper: FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className='mx-auto max-w-[1075px]'>{children}</div>;
};

export default ContentWrapper;