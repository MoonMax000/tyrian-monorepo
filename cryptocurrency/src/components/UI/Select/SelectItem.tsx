import { Option } from '@/components/UI/Select/types';

interface SelectItemProps {
  option: Option;
  onSelect: (option: Option) => void;
}

export const SelectItem = ({ option, onSelect }: SelectItemProps) => {
  return (
    <li
      className="px-3 py-2.5 flex items-center gap-2 font-semibold hover:bg-white hover:bg-opacity-10 rounded-lg cursor-pointer"
      onClick={() => onSelect(option)}
    >
      {option.icon && <span>{option.icon}</span>}
      {option.label}
    </li>
  );
};