import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

export const CURRENCIES = [
  'RUB','USD','EUR','HKD','GBP','JPY','CNY',
  'SGD','SEK','NOK','DKK','CZK','CHF','TRY',
  'UAH','KZT','CAD','AMD','THB','BYN','PLN',
  'AED','AUD','INR','GEL','MDL','ILS','UZS','KGS',
] as const;

export type CurrencyCode = typeof CURRENCIES[number];

interface CurrencySelectProps {
  value: CurrencyCode;
  onChange: (value: CurrencyCode) => void;
  className?: string;
  triggerClassName?: string;
  placeholder?: string;
}

const CurrencySelect: React.FC<CurrencySelectProps> = ({
  value,
  onChange,
  className,
  triggerClassName,
  placeholder = 'Select currency',
}) => {
  return (
    <div className={className}>
      <Select value={value} onValueChange={(v) => onChange(v as CurrencyCode)}>
        <SelectTrigger
          className={`h-10 rounded-xl border border-tyrian-gray-darker glass-card bg-transparent text-white px-3 py-2 w-full min-w-[96px] justify-between ${
            triggerClassName || ''
          }`}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="z-[120] border border-tyrian-gray-darker bg-[#0C1014] text-white shadow-lg">
          {CURRENCIES.map((code) => (
            <SelectItem key={code} value={code} className="text-white">
              {code}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CurrencySelect;
