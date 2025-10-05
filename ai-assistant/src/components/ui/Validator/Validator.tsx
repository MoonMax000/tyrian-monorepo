import React, { useEffect } from 'react';
import Toe from '@/assets/indicators/toe.svg';
import Cross from '@/assets/indicators/cross.svg';
import CheckMark from '@/assets/indicators/check-mark.svg';

interface Props {
  password: string;
  setIsValid: (isValid: boolean) => void;
}

interface ValidationRule {
  label: string;
  test: (value: string) => boolean;
}

interface ValidationResult {
  label: string;
  isValid: boolean | null;
}

export const Validator: React.FC<Props> = ({ password, setIsValid }) => {
  const rules: ValidationRule[] = [
    {
      label: 'At least 12 characters',
      test: (value: string) => value.length >= 12,
    },
    {
      label: 'Uppercase and lowercase',
      test: (value: string) => /\p{Lu}/u.test(value) && /\p{Ll}/u.test(value),
    },
    {
      label: 'A number',
      test: (value: string) => /\d/.test(value),
    },
    {
      label: 'A special character',
      test: (value: string) => /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/.test(value),
    },
  ];

  const validationResults: ValidationResult[] = rules.map((rule) => ({
    label: rule.label,
    isValid: password ? rule.test(password) : null,
  }));

  useEffect(() => {
    const isValid: boolean = validationResults.every((result) => result.isValid === true);
    setIsValid(isValid);
  }, [password, setIsValid, validationResults]);

  const StatusIcon: React.FC<{ isValid: boolean | null }> = ({ isValid }) => {
    if (isValid === null) {
      return <Toe />;
    }
    if (isValid) {
      return <CheckMark />;
    }
    return <Cross />;
  };

  return (
    <div>
      <p className='text-webGray text-15  font-semibold'> Your password needs to:</p>
      <ul className='list-none'>
        {validationResults.map((result, index) => (
          <li
            key={index}
            className='flex items-center text-webGray text-[15px] font-normal justify-start gap-2 mb-1'
          >
            <StatusIcon isValid={result.isValid} />

            {result.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Validator;
