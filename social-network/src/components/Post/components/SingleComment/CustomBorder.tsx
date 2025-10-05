import { cn } from '@/utilts/cn';

export type TBorderVariant = 'direct' | 'folded';

interface CustomBorderProps {
  className?: string;
  variant?: TBorderVariant;
}

export function CustomBorder({ className, variant = 'direct' }: CustomBorderProps) {
  return (
    <div
      className={cn(
        ' border-l-[2px] border-[#FFFFFF29] w-5 h-8 ',
        { 'border-b-[2px] rounded-bl-lg mr-3': variant === 'direct', 'mb-3': variant === 'folded' },
        className,
      )}
    />
  );
}
