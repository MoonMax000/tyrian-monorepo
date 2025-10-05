import React from 'react';

type ButtonVariants =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'shadow'
  | 'ghost'
  | 'ghostPurpule'
  | 'blacked'
  | 'dark'
  | 'gradient';

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
  isActive?: boolean;
}
