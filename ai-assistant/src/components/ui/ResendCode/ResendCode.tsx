import React, { FC } from 'react';

interface Props {
  timeLeft: string;
}

export const ResendCode: FC<Props> = ({ timeLeft }) => {
  return (
    <span className='text-[#808283] text-[15px] font-bold text-center'>
      You can resend the code in {timeLeft} seconds...
    </span>
  );
};
