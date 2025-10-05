import { InputHTMLAttributes, ReactNode } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  tip?: React.ReactNode;
  tipPosition?: 'top' | 'bottom' | 'left' | 'right';
  containerClassName?: string;
  inputWrapperClassName?: string;
  tipClassName?: string;
  children?: ReactNode;
  borderError?: boolean;
  label?: string;
}
