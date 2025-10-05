import clsx from 'clsx';
import { FC } from 'react';

const Loaders: FC<{ className?: string }> = ({ className = '' }) => {
  return <div role='status' className={clsx('animate-pulse bg-gray rounded-md', className)} />;
};

export default Loaders;
