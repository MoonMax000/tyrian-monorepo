import clsx from 'clsx';
import { DetailedHTMLProps, FC, HTMLAttributes } from 'react';

interface ContainerProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  as?: 'div' | 'section';
}

const Container: FC<ContainerProps> = ({ as: Tag = 'div', className, children, ...rest }) => {
  return (
    <Tag className={clsx(className, 'mt-6 mx-auto max-w-[1080px] maxContainer:px-2')} {...rest}>
      {children}
    </Tag>
  );
};

export default Container;
