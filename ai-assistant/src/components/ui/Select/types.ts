export interface Option<T = string | number> {
  label: string;
  value: T;
  icon?: React.ReactNode;
}

export interface SelectProps {
  options: Option[];
  onChange: (option: Option) => void;
  placeholder?: string;
  value?: string | number;
  className?: string;
  wrapperClassName?: string;
  disabled?: boolean;
}
