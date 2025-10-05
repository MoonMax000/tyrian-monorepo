'use client';
import { FC, ReactNode } from 'react';
import { ResendCode } from '../ResendCode/ResendCode';
import { Input } from '../Input';
import useTimer from '@/hooks/useTimer';
import { cn } from '@/utilts/cn';

interface Props {
  title?: string;
  description?: string | ReactNode;
  values: string[];

  setCodeArr: (values: string[]) => void;
  onSubmit?: (values: string) => void;
  onResendCode?: () => void;
  codeError: string;
}

export const VerifyCode: FC<Props> = ({
  title,
  description,
  values,
  setCodeArr,
  onSubmit,
  codeError,
  onResendCode,
}) => {
  const { startTimer, timeLeft, isRunning } = useTimer();

  const handleInputChange = (index: number, value: string) => {
    if (/^[0-9]?$/.test(value)) {
      const newValues = [...values];
      newValues[index] = value;
      setCodeArr(newValues);
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-input-${index + 1}`);
        nextInput?.focus();
      }
      const code = newValues.join('');

      if (code.length === 6 && onSubmit) {
        onSubmit(code);
        if (code === '111111') setCodeArr(['', '', '', '', '', '']);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !values[index] && index > 0) {
      const prevInput = document.getElementById(`code-input-${index - 1}`);
      prevInput?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      const prevInput = document.getElementById(`code-input-${index - 1}`);
      prevInput?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      const nextInput = document.getElementById(`code-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData('text')
      .slice(0, 6)
      .replace(/[^0-9]/g, '');
    const newValues = [...values];

    for (let i = 0; i < pastedData.length && i < 6; i++) {
      newValues[i] = pastedData[i];
    }

    setCodeArr(newValues);

    const code = newValues.join('');
    if (code.length === 6 && onSubmit) {
      onSubmit(code);
      setCodeArr(['', '', '', '', '', '']);
    }

    const nextEmptyIndex = newValues.findIndex((val, idx) => !val && idx >= pastedData.length);
    const focusIndex = nextEmptyIndex === -1 ? Math.min(pastedData.length, 5) : nextEmptyIndex;
    const input = document.getElementById(`code-input-${focusIndex}`);
    input?.focus();
  };

  const handleSelect = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const valueLength = input.value.length;
    input.setSelectionRange(valueLength, valueLength);
  };

  const handleResendCode = () => {
    startTimer();
    setCodeArr([]);
    onResendCode?.();
  };


  return (
    <div className='flex flex-col text-center justify-between h-full '>
      <div className='flex flex-col'>
        {title && <h2 className='text-2xl font-semibold mb-2'>{title}</h2>}
        {typeof description === 'string' && (
          <p className='text-[15px] font-normal  text-lighterAluminum mb-6 text-left'>
            {description}
          </p>
        )}
        {typeof description !== 'string' && description && description}

        <div className='flex gap-2 justify-center'>
          {Array.from({ length: 6 }).map((_, index) => (
            <Input
              key={index}
              id={`code-input-${index}`}
              type='text'
              value={values[index] || ''}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              onSelect={handleSelect}
              className={cn(
                'w-12 h-12 text-center text-[19px] font-semibold rounded-md border-[1px] ',
                { 'border-[#2E2744]': !codeError, 'border-red': codeError },
              )}
              maxLength={1}
              autoComplete='off'
            />
          ))}
        </div>
        {codeError && <p className='font-normal text-[15px] text-center mt-2'>{codeError}</p>}
      </div>

      {!isRunning ? (
        <p
          className='font-normal text-[15px] w-fit text-purple cursor-pointer mx-auto'
          aria-disabled={isRunning}
          onClick={handleResendCode}
        >
          Resend Code
        </p>
      ) : (
        <ResendCode timeLeft={timeLeft} />
      )}
    </div>
  );
};
