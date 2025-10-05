import React from 'react'

interface CounterProps {
  value: number;
}

function Counter({ value }: CounterProps) {
  return (
    <div className='flex items-center justify-center px-2 py-[2px] bg-primary rounded-[24px]'>
      <span className='text-[12px] font-extrabold'>
        {value}
      </span>
    </div>
  )
}

export default Counter
