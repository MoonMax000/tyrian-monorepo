import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/shadcnui/tooltip';

interface CustomTooltipProps {
  content: string;
  children: React.ReactNode;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ content, children }) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side='bottom' className='bg-onyxGrey text-[15px] font-bold border-none'>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CustomTooltip;