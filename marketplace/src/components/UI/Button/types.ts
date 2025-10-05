import React from 'react';

type ButtonVariants = 'primary' | 'secondary' | 'danger' | 'shadow' | 'lock' | 'gray';
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
  childrenClassname?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}
