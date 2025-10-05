import React from 'react';
import clsx from 'clsx';

interface IProps {
  children: React.ReactNode,
  className?: string
}

const ButtonGroup = ({children, className}: IProps) => {
  return (
    <div className={clsx('flex items-center gap-2', className)}>{children}</div>
  )
}

export default ButtonGroup;