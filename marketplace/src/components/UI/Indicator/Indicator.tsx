import { FC } from 'react';
import { TIndicator } from './types';
import { cn } from '@/utils/cn';

interface Props {
  color: TIndicator;
  className?: string;
}

const colors: Record<TIndicator, string> = {
  red: 'bg-red',
  green: 'bg-green',
  gray: 'bg-webGray',
  orange: 'bg-orange',
  blue: 'bg-blue',
};

const Indicator: FC<Props> = ({ color, className = '' }) => {
  return <div className={cn('min-w-2 h-2 rounded-full', colors[color], className)}></div>;
};

export default Indicator;
