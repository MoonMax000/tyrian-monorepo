import React, { ReactNode } from 'react';

type LogoWithNameProps = {
  icon: ReactNode;
  label: string;
  className?: string;
  iconSize?: string;
};

function LogoWithName({
  icon,
  label,
  className,
  iconSize = 'w-4 h-4',
}: LogoWithNameProps) {
  return (
    <div className={`flex gap-1 ${className ?? 'items-center'}`}>
      <span className={iconSize}>{icon}</span>
      <span className="text-white text-body-15">{label}</span>
    </div>
  );
}

export default LogoWithName;
