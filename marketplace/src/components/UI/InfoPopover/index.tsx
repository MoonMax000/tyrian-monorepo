import React from 'react';
import Paper from '@/components/UI/Paper';

interface InfoPopoverProps {
  text: string;
}

const InfoPopover = ({ text }: InfoPopoverProps) => {
  return (
    <div className="relative w-[260px]">
      <Paper className="shadow-[2px_8px_8px_rgba(0,0,0,0.36)] bg-moonlessNight !text-white p-3 rounded-lg w-full h-full text-body-12 uppercase">
        {text}
      </Paper>
      <div
        className="absolute -left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rotate-45 bg-moonlessNight"
        style={{ borderRadius: '2px' }}
      />
    </div>
  );
};

export default InfoPopover;
