import clsx from 'clsx';
import { FC } from 'react';

interface IProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

const Image: FC<IProps> = ({ src, alt, className, width, height }) => {
  if (!src) return null;
  return <img className={clsx(className, 'block')} alt={alt} src={src} style={{ width, height }} />;
};

export default Image;
