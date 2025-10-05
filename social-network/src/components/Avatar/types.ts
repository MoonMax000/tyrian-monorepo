import { StaticImageData } from 'next/image';

export interface AvatarProps {
  src: string | StaticImageData | undefined;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}