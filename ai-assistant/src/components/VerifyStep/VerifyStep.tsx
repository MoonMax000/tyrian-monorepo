'use client';

import { Dispatch, ReactNode, SetStateAction, useState } from 'react';

import { VerifyCode } from '../ui/VerifyCode/VerifyCode';
import Button from '../ui/Button/Button';

interface VerifyStepProps {
  title: string;
  description: string | ReactNode;
  onBack: () => void;
  onResendCode: () => void;
  initialCode?: string[];
  codeError?: string;
  handleSubmit: (values: string) => void;
  setCodeError: Dispatch<SetStateAction<string>>;
}

const VerifyStep = ({
  title,
  description,
  onBack,
  onResendCode,
  codeError = '',
  handleSubmit,
  setCodeError,
  initialCode = ['', '', '', '', '', ''],
}: VerifyStepProps) => {
  const [codeArr, setCodeArr] = useState<string[]>(initialCode);

  const handleSetCodeArr = (values: string[]) => {
    setCodeError('');
    setCodeArr(values);
  };

  return (
    <div className='h-full flex flex-col gap-[10px]'>
      <VerifyCode
        title={title}
        description={description}
        values={codeArr}
        codeError={codeError}
        onResendCode={onResendCode}
        onSubmit={handleSubmit}
        setCodeArr={handleSetCodeArr}
      />
      <div className='flex gap-4 justify-between'>
        <Button
          ghost
          className='text-lighterAluminum w-full'
          type='button'
          onClick={() => onBack()}
        >
          Back
        </Button>
        <Button className='w-full'>Continue</Button>
      </div>
    </div>
  );
};

export default VerifyStep;
