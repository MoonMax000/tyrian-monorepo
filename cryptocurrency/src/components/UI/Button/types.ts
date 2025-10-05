import React from 'react';

type ButtonVariants = 'primary' | 'secondary' | 'danger' | 'shadow';
type ButtonTypes = 'button' | 'submit' | 'reset';

export interface ButtonProps {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: ButtonVariants;
  type?: ButtonTypes;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  disabled?: boolean;
  size?: 'sm' | 'md';
}