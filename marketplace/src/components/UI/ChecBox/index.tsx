'use client';
import clsx from 'clsx';
import { FC, useState } from 'react';
import Image from 'next/image';

interface CheckBoxProps {
  className?: string;
  label?: string;
}

const CheckBox: FC<CheckBoxProps> = ({ className }) => {
  const [isActive, setActive] = useState<boolean>(false);
  const handleClick = () => {
    setActive((prev) => !prev);
  };
  return (
    <div
      className={clsx(className, 'size-4 rounded-[3px] cursor-pointer', {
        'border opacity-[16%]': !isActive,
      })}
      onClick={handleClick}
    >
      {isActive && <Image src='/icons/checkbox.svg' alt='ok' width={18} height={18} />}
    </div>
  );
};

export default CheckBox;
