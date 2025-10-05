import clsx from 'clsx';
import React from 'react';

type IndicatorTagType = 'red' | 'moonless' | 'purple' | 'darckGreen' | 'orange';

interface IndicatorTagProps {
  type: IndicatorTagType;
  children: React.ReactNode;
  className?: string;
}

interface IndicatorTagStyle {
  backgroundColor: string;
  color?: string;
  classname?: string;
}

const indicatorTagStyles: Record<IndicatorTagType, IndicatorTagStyle> = {
  red: { backgroundColor: 'bg-darkRed', color: 'text-red' },
  moonless: {
    backgroundColor: 'bg-moonlessNight',
  },
  purple: { backgroundColor: 'bg-gunpowder', color: 'text-lightPurple' },
  darckGreen: { backgroundColor: 'bg-darkGreen', color: 'text-green' },
  orange: { backgroundColor: 'bg-darkOrange', color: 'text-orange' },
};

export const IndicatorTag: React.FC<IndicatorTagProps> = ({
  type,
  children,
  className,
}) => {
  const { backgroundColor, color } = indicatorTagStyles[type];

  return (
    <div
      className={clsx(
        `rounded-[4px] px-2 py-[2px] `,
        backgroundColor,
        color,
        className,
      )}
    >
      {children}
    </div>
  );
};
